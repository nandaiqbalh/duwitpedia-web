import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Get token (works with both JWT and database sessions)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Protected user routes
  const userRoutes = ["/dashboard", "/accounts", "/wallets", "/categories", "/transactions", "/reports", "/settings"];
  const isUserRoute = userRoutes.some(route => path.startsWith(route));
  
  if (isUserRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin routes - redirect to dashboard if not admin
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/accounts/:path*", "/wallets/:path*", "/categories/:path*", "/transactions/:path*", "/reports/:path*", "/settings/:path*"],
};
