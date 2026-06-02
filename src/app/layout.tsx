import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sarabun } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LanguageSelector, RegionalFloatingAd } from "@burrowsoft/shared";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

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

const SIBLING_PRODUCTS = [
  { name: "FlyMole", href: "https://flymole.com" },
  { name: "BookingMole", href: "https://bookingmole.com" },
  { name: "RentACarMole", href: "https://rentacarmole.com" },
  { name: "GamesMole", href: "https://gamesmole.com" },
  { name: "ShoppingMole", href: "https://shoppingmole.com" },
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={sarabun.variable}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-[family-name:var(--font-sarabun)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav
              className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
              aria-label="Main navigation"
            >
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                <Image src="/mascot.svg" alt="" width={28} height={28} aria-hidden />
                {SITE_NAME}
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">Updated every 15 min</span>
                <LanguageSelector locales={["en", "th"]} />
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
                    src="/burrowsoft-logo.svg"
                    alt="BurrowSoft"
                    width={160}
                    height={32}
                    unoptimized
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
