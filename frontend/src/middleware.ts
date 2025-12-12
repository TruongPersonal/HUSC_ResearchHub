import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // List of paths that don't require authentication
  const publicPaths = ["/login", "/forgot-password", "/images", "/icons"];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect root path to role-based dashboard
  if (token && request.nextUrl.pathname === "/") {
    try {
      const decoded = jwtDecode<{ role: string }>(token);
      const role = decoded.role;

      if (role === "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (role === "ROLE_STUDENT") {
        return NextResponse.redirect(new URL("/student", request.url));
      } else if (role === "ROLE_TEACHER") {
        return NextResponse.redirect(new URL("/teacher", request.url));
      } else if (role === "ROLE_ASSISTANT") {
        return NextResponse.redirect(new URL("/assistant", request.url));
      }
    } catch {
      // If token is invalid, let it proceed (or redirect to login)
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect role-specific routes
  if (token) {
    try {
      const decoded = jwtDecode<{ role: string }>(token);
      const role = decoded.role;

      if (
        request.nextUrl.pathname.startsWith("/admin") &&
        role !== "ROLE_ADMIN"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        request.nextUrl.pathname.startsWith("/student") &&
        role !== "ROLE_STUDENT"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        request.nextUrl.pathname.startsWith("/teacher") &&
        role !== "ROLE_TEACHER"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        request.nextUrl.pathname.startsWith("/assistant") &&
        role !== "ROLE_ASSISTANT"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
