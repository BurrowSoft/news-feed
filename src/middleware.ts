import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "th"],
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: true,
});

function countryToLocale(req: NextRequest): string {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "US";
  return country === "TH" ? "th" : "en";
}

export default function middleware(req: NextRequest): NextResponse {
  // If no explicit locale cookie, seed it from country detection so
  // next-intl's built-in cookie detection picks the right default.
  if (!req.cookies.has("NEXT_LOCALE")) {
    const detected = countryToLocale(req);
    const res = intlMiddleware(req) as NextResponse;
    res.cookies.set("NEXT_LOCALE", detected, { path: "/", maxAge: 31536000 });
    return res;
  }
  return intlMiddleware(req) as NextResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
