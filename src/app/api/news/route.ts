import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createNewsRouter, summarize } from "@burrowsoft/shared";
import type { NewsCategory, NewsArticle, AISummary } from "@burrowsoft/shared";

export interface ProviderResult {
  name: string;
  count: number;
  error: boolean;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  providers: ProviderResult[];
  summary: AISummary | null;
}

const VALID_CATEGORIES = new Set<NewsCategory>([
  "general", "business", "technology", "sports", "entertainment", "health", "science",
]);

const SUPPORTED_LOCALES = new Set([
  "en", "th", "es", "ru", "pt-BR", "fr", "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
]);

// Map locale → language code for API params
const LOCALE_TO_LANGUAGE: Record<string, string> = {
  "en": "en", "th": "th", "es": "es", "ru": "ru", "pt-BR": "pt",
  "fr": "fr", "ja": "ja", "zh": "zh", "zh-TW": "zh",
  "ar": "ar", "de": "de", "id": "id", "ko": "ko", "it": "it", "vi": "vi",
};

async function fetchNews(
  category: NewsCategory,
  country: string,
  locale: string
): Promise<NewsApiResponse> {
  const language = LOCALE_TO_LANGUAGE[locale] ?? "en";
  const router = createNewsRouter(country, language);
  const providers = router.getProviders();

  const pageSize = 30;
  const params = { pageSize, country, language, category };

  const results = await Promise.allSettled(providers.map((p) => p.search(params)));

  const providerResults: ProviderResult[] = providers.map((p, i) => {
    const r = results[i];
    if (r?.status === "fulfilled") {
      return { name: p.name, count: r.value.length, error: false };
    }
    return { name: p.name, count: 0, error: true };
  });

  const articles = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const summary = await summarize("news", articles, country);

  return { articles, providers: providerResults, summary };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const rawCategory = searchParams.get("category") ?? "general";
  const country = (searchParams.get("country") ?? "US").toUpperCase();
  const locale = searchParams.get("locale") ?? "en";

  const category: NewsCategory = VALID_CATEGORIES.has(rawCategory as NewsCategory)
    ? (rawCategory as NewsCategory)
    : "general";

  const validLocale = SUPPORTED_LOCALES.has(locale) ? locale : "en";
  const cacheKey = `news:${category}:${country}:${validLocale}`;

  // ?nocache=1 bypasses unstable_cache — shows live provider results for debugging
  const skipCache = searchParams.get("nocache") === "1";

  try {
    const data = skipCache
      ? await fetchNews(category, country, validLocale)
      : await unstable_cache(
          () => fetchNews(category, country, validLocale),
          [cacheKey],
          { revalidate: 900 }
        )();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { articles: [], providers: [], summary: null, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
