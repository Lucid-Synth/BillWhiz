import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  };

  // Check for session cookie
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all API routes except auth
    "/api/((?!auth|uploadthing).*)",
  ],
};
