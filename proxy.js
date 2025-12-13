import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD, WEBSITE_LOGIN } from "./routes/AdminPanelRoute"
import { USER_DASHBOARD, WEBSITE } from "./routes/WebsiteRoute"
import { PROVIDER_DASHBOARD } from "./routes/ProviderPanelRoute"
import { MASTER_DASHBOARD } from "./routes/MasterPanelRoute"

export async function proxy(request) {
  const url = request.nextUrl
  const pathname = url.pathname
  const hasToken = request.cookies.has("access_token")

  // 🔹 Handle token verification error (expired token) properly
  let tokenValid = false
  let role = null

  if (hasToken) {
    const token = request.cookies.get("access_token").value
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.SECRET_KEY)
      )
      tokenValid = true
      role = payload.role
    } catch (err) {
      // Token is invalid or expired - clear it
      tokenValid = false
      role = null
    }
  }

  // 🔹 Public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password"
  ]

  // If no valid token
  if (!tokenValid) {
    // Clear expired/invalid token cookie
    const response = NextResponse.next()
    response.cookies.delete("access_token")

    // Allow access to public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
      return response
    }

    // Redirect to login for protected paths
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }

  // 🔹 If we have a valid token...

  // Logged-in users shouldn’t access auth pages (except specific ones)
  if (pathname.startsWith("/auth")) {
    // Allow some auth pages even when logged in
    const allowedWhenLoggedIn = [
      "/auth/logout",
      "/auth/verify-email", // Allow email verification even when logged in
    ]

    if (allowedWhenLoggedIn.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Redirect to appropriate dashboard if trying to access login/register
    const redirectTo =
      role === "admin"
        ? ADMIN_DASHBOARD
        : role === "provider"
          ? PROVIDER_DASHBOARD
          : role === "master"
            ? MASTER_DASHBOARD
            : role === 'user'
              ? USER_DASHBOARD
              : WEBSITE


    return NextResponse.redirect(new URL(redirectTo, url))
  }

  // 🔹 Role-based protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }
  if (pathname.startsWith("/provider") && role !== "provider") {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }
  if (pathname.startsWith("/my-account") && role !== "user") {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }
  if (pathname.startsWith("/master") && role !== "master") {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/provider/:path*",
    "/my-account/:path*",
    "/auth/:path*",
    "/master/:path*"
  ],
}