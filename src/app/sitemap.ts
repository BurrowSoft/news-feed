import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://www.insightmole.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 1.0,
  }));
}
