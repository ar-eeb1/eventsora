import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD, WEBSITE_LOGIN } from "./routes/AdminPanelRoute"
import { USER_DASHBOARD, WEBSITE } from "./routes/WebsiteRoute"
import { PROVIDER_DASHBOARD } from "./routes/ProviderPanelRoute"
import { MASTER_DASHBOARD } from "./routes/MasterPanelRoute"

export async function proxy(request) {
  const url = request.nextUrl
  const pathname = url.pathname

  // 1. Allow static assets, API, and files with extensions (.png, .css, etc.)
  const isStaticAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.includes('favicon.ico') ||
                        pathname.includes('.')

  if (isStaticAsset) {
    return NextResponse.next()
  }

  // 2. Check protected routes
  const isProtectedRoute = pathname.startsWith("/admin") || 
                           pathname.startsWith("/provider") || 
                           pathname.startsWith("/auth") || 
                           pathname.startsWith("/master") ||
                           pathname.startsWith("/my-account") ||
                           pathname.startsWith("/user") ||
                           pathname.startsWith("/booking") ||
                           pathname.startsWith("/checkout") ||
                           pathname.startsWith("/profile") ||
                           pathname.startsWith("/my-bookings") ||
                           pathname === "/suspended"

  // 3. Auth logic for Protected Routes
  const hasToken = request.cookies.has("access_token")
  let tokenValid = false
  let role = null

  if (hasToken) {
    const token = request.cookies.get("access_token").value
    try {
      const secretKey = process.env.SECRET_KEY || ''
      const secret = new TextEncoder().encode(secretKey)
      const { payload } = await jwtVerify(token, secret)
      tokenValid = true
      role = payload.role
    } catch (err) {
      tokenValid = false
      role = null
    }
  }

  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ]

  // If no valid token
  if (!tokenValid) {
    if (publicPaths.some(path => pathname.startsWith(path)) || !isProtectedRoute) {
      const response = NextResponse.next()
      if (hasToken) {
        response.cookies.delete("access_token")
      }
      return response
    }

    const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
    if (hasToken) {
      response.cookies.delete("access_token")
    }
    return response
  }

  // If user account is suspended, send to suspension page
  if (role === 'suspended' && pathname !== '/suspended') {
    const resp = NextResponse.redirect(new URL('/suspended', url))
    resp.cookies.delete('access_token')
    return resp
  }

  // Prevent logged in users from visiting auth pages except logout/verify-email
  if (pathname.startsWith("/auth")) {
    const allowedWhenLoggedIn = [
      "/auth/logout",
      "/auth/verify-email", 
    ]

    if (allowedWhenLoggedIn.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

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

  // Role-based route protection
  if (pathname.startsWith("/admin") && !["admin", "master"].includes(role)) {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }
  if (pathname.startsWith("/provider") && !["provider", "master"].includes(role)) {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
