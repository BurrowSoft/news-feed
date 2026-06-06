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
import { headers } from "next/headers";
import { detectCountry, getCountryName, RegionalFloatingAd, AppHeader, AppFooter } from "@burrowsoft/shared";
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

const ALL_FONT_VARS = [inter.variable, sarabun.variable, notoJP.variable, notoSC.variable, notoTC.variable, notoKR.variable, notoAR.variable].join(" ");

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
  "publisher": { "@type": "Organization", "name": "BurrowSoft", "url": "https://www.burrowsoft.com" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const countryName = getCountryName(country);
  const desc = `Get the latest news from ${countryName} and around the world. InsightMole aggregates top sources in real time. No paywalls. No sign-up. Always free.`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${countryName} & World News — Insight Mole`,
      template: `%s | Insight Mole`,
    },
    description: desc,
    keywords: ["trending news", "top headlines", "breaking news", "world news", "latest news"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      siteName: SITE_NAME,
      title: `${countryName} & World News — Insight Mole`,
      description: desc,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${countryName} & World News — Insight Mole`,
      description: desc,
      images: ["/og-image.png"],
    },
    other: { "google-adsense-account": "ca-pub-1009857008755875" },
    alternates: {
      canonical: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, l === "en" ? `${BASE}/` : `${BASE}/${l}/`]),
        ["x-default", `${BASE}/`],
      ]),
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

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
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={ALL_FONT_VARS}>
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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased" style={bodyStyle}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppHeader
            logo={
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/news.png" alt="InsightMole" width={40} height={40} className="shrink-0" priority />
                <span className="text-lg font-bold tracking-tight text-indigo-600">{SITE_NAME}</span>
              </Link>
            }
            right={
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">Updated every 15 min</span>
                <LocaleLanguageSelector locales={routing.locales} />
              </div>
            }
          />

          <main>{children}</main>
          <RegionalFloatingAd />

          <AppFooter
            supportEmail="support@insightmole.com"
            accentHoverClass="hover:text-indigo-600"
            currentSite="InsightMole"
            attribution="News powered by GNews, The Guardian & NewsAPI"
          />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
