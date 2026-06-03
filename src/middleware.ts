import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

const LOCALES = [
  "en", "th", "es", "ru", "pt-BR", "fr",
  "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
] as const;

const COUNTRY_LOCALE: Record<string, string> = {
  TH: "th",
  // Spanish-speaking
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  UY: "es", PY: "es", BO: "es", EC: "es", CR: "es", PA: "es", DO: "es",
  GT: "es", HN: "es", SV: "es", NI: "es", CU: "es",
  // Portuguese
  BR: "pt-BR", PT: "pt-BR",
  // French
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", LU: "fr", MC: "fr",
  // Japanese
  JP: "ja",
  // Chinese Simplified
  CN: "zh",
  // Chinese Traditional
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", KW: "ar", QA: "ar",
  BH: "ar", OM: "ar", JO: "ar", LB: "ar", MA: "ar",
  DZ: "ar", TN: "ar", LY: "ar", IQ: "ar", SY: "ar", YE: "ar",
  // German
  DE: "de", AT: "de",
  // Indonesian
  ID: "id",
  // Korean
  KR: "ko",
  // Italian
  IT: "it",
  // Vietnamese
  VN: "vi",
  // Russian
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru",
};

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: true,
});

function detectLocale(req: NextRequest): string {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "US";
  return COUNTRY_LOCALE[country] ?? "en";
}

export default function middleware(req: NextRequest): NextResponse {
  if (!req.cookies.has("NEXT_LOCALE")) {
    const detected = detectLocale(req);
    const res = intlMiddleware(req) as NextResponse;
    res.cookies.set("NEXT_LOCALE", detected, { path: "/", maxAge: 31536000 });
    return res;
  }
  return intlMiddleware(req) as NextResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
