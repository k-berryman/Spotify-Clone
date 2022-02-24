import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // If it's a request for a next-auth session or the token exists, go through
  if(pathname.includes('/api/auth') || token) {
    // Middleware allows them to go through
    return NextResponse.next();
  }

  // Redirect them to Login
  // Don't let them in!
  if(!token && pathname !== '/login') {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url);
  }
}
