import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD, WEBSITE_LOGIN } from "./routes/AdminPanelRoute"
import { USER_DASHBOARD, WEBSITE } from "./routes/WebsiteRoute"
import { PROVIDER_DASHBOARD } from "./routes/ProviderPanelRoute"
import { MASTER_DASHBOARD } from "./routes/MasterPanelRoute"

export async function proxy(request) {
  const url = request.nextUrl
  const pathname = url.pathname

  // 1. Allow static assets, API, and the Coming Soon page itself
  const isStaticAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.includes('favicon.ico') ||
                        pathname.includes('.') // common check for files
  
  if (isStaticAsset) {
    return NextResponse.next()
  }

  // 2. check if it's a website route that should be blocked
  // These are routes NOT starting with /admin, /provider, /auth, /master
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

  // 3. Existing Auth logic for Protected Routes
  const hasToken = request.cookies.has("access_token")
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
    // Clear expired/invalid token cookie
    const response = NextResponse.next()
    response.cookies.delete("access_token")

    // Allow access to public paths (auth related) OR non-protected website routes
    if (publicPaths.some(path => pathname.startsWith(path)) || !isProtectedRoute) {
      return response
    }

    // Redirect to login 
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, url))
  }

  // for valid token

  // if user account is suspended, always send to suspension page
  if (role === 'suspended' && pathname !== '/suspended') {
    const resp = NextResponse.redirect(new URL('/suspended', url))
    // also clear token to force login if they try again
    resp.cookies.delete('access_token')
    return resp
  }

  // users can't access login page
  if (pathname.startsWith("/auth")) {
    const allowedWhenLoggedIn = [
      "/auth/logout",
      "/auth/verify-email", // Allow email verification 
    ]

    if (allowedWhenLoggedIn.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Redirect
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

  // rolebased protection
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
