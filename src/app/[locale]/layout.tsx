import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Inter,
  Sarabun,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Sans_KR,
  Noto_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { RegionalFloatingAd } from "@burrowsoft/shared";
import { Link } from "@/i18n/navigation";
import { LocaleLanguageSelector } from "@/components/LocaleLanguageSelector";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "../globals.css";

const inter   = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-inter", display: "swap" });
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], variable: "--font-sarabun", display: "swap" });
const notoJP  = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-jp", display: "swap" });
const notoSC  = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-sc", display: "swap" });
const notoTC  = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-tc", display: "swap" });
const notoKR  = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-kr", display: "swap" });
const notoAR  = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-noto-ar", display: "swap" });

const ALL_FONT_VARS = [
  inter.variable, sarabun.variable, notoJP.variable, notoSC.variable,
  notoTC.variable, notoKR.variable, notoAR.variable,
].join(" ");

const LOCALE_FONT: Partial<Record<string, string>> = {
  th: "var(--font-sarabun)",
  ja: "var(--font-noto-jp)",
  zh: "var(--font-noto-sc)",
  "zh-TW": "var(--font-noto-tc)",
  ko: "var(--font-noto-kr)",
  ar: "var(--font-noto-ar)",
};

const BASE = "https://www.insightmole.com";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "InsightMole",
  "url": BASE,
  "description": "Trending news and top headlines updated around the clock.",
  "publisher": {
    "@type": "Organization",
    "name": "BurrowSoft",
    "url": "https://www.burrowsoft.com",
  },
};

const SIBLING_PRODUCTS = [
  { name: "FlyMole", href: "https://flymole.com" },
  { name: "BookingMole", href: "https://bookingmole.com" },
  { name: "RentACarMole", href: "https://rentacarmole.com" },
  { name: "GamesMole", href: "https://gamesmole.com" },
  { name: "ShoppingMole", href: "https://shoppingmole.com" },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Trending News & Top Headlines`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["trending news", "top headlines", "breaking news", "world news", "latest news"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Trending News & Top Headlines`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Trending News & Top Headlines`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: { "google-adsense-account": "ca-pub-1009857008755875" },
  alternates: {
    canonical: `${BASE}/`,
    languages: Object.fromEntries([
      ...routing.locales.map((locale) => [
        locale,
        locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      ]),
      ["x-default", `${BASE}/`],
    ]),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  const activeFont = LOCALE_FONT[locale];
  const bodyStyle = { fontFamily: activeFont ?? "var(--font-inter), sans-serif" };

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={ALL_FONT_VARS}
    >
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
      />
      <body
        className="min-h-screen bg-slate-50 text-slate-900 antialiased"
        style={bodyStyle}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav
              className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
              aria-label="Main navigation"
            >
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/news.png"
                  alt="InsightMole"
                  width={40}
                  height={40}
                  className="shrink-0"
                  priority
                />
                <span className="text-lg font-bold tracking-tight text-indigo-600">{SITE_NAME}</span>
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">Updated every 15 min</span>
                <LocaleLanguageSelector locales={routing.locales} />
              </div>
            </nav>
          </header>

          <main>{children}</main>
          <RegionalFloatingAd />

          <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <a
                  href="https://burrowsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="BurrowSoft"
                >
                  <Image
                    src="/base.png"
                    alt="BurrowSoft"
                    width={48}
                    height={48}
                  />
                </a>
                <nav aria-label="BurrowSoft products" className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {SIBLING_PRODUCTS.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {p.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400">
                <p>© 2025 BurrowSoft. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:support@insightmole.com"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    support@insightmole.com
                  </a>
                  <span>News powered by GNews, The Guardian &amp; NewsAPI</span>
                </div>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
