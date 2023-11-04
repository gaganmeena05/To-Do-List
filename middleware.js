import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  // If the user is logged in, continue to the API
  // Otherwise, redirect to the login page
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  if (!token && request.nextUrl.pathname ==="/") return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
