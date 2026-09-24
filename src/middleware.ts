import { NextRequest, NextResponse } from "next/server";

// Lightweight route-guard: presence of the cookie only (full JWT verification
// happens again in each API route / server component, since middleware runs
// on the edge runtime where some Node APIs are unavailable).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("kb_admin_token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account")) {
    const token = req.cookies.get("kb_customer_token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
