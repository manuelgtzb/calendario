import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = request.cookies.get("admin_session")?.value;
  const expectedSession = process.env.ADMIN_SESSION_TOKEN;

  const authenticated =
    Boolean(session) &&
    Boolean(expectedSession) &&
    session === expectedSession;

  if (pathname.startsWith("/admin/dashboard") && !authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname === "/admin" && authenticated) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};