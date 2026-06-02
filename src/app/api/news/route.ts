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
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
]);

async function fetchNews(
  category: NewsCategory,
  country: string,
  locale: string
): Promise<NewsApiResponse> {
  const isThai = locale === "th";
  const language = isThai ? "th" : "en";
  const effectiveCountry = isThai ? "TH" : country;

  const router = createNewsRouter();
  const allProviders = router.getProvidersForCountry(effectiveCountry);

  // The Guardian has no Thai content — skip it when locale is th
  const providers = isThai
    ? allProviders.filter((p) => p.name !== "The Guardian")
    : allProviders;

  const pageSize = 30;
  const params = { pageSize, country: effectiveCountry, language, category };

  const results = await Promise.allSettled(
    providers.map((p) => p.search(params))
  );

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

  const summary = await summarize("news", articles, effectiveCountry);

  return { articles, providers: providerResults, summary };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const rawCategory = searchParams.get("category") ?? "general";
  const country = searchParams.get("country") ?? "US";
  const locale = searchParams.get("locale") ?? "en";

  const category: NewsCategory = VALID_CATEGORIES.has(rawCategory as NewsCategory)
    ? (rawCategory as NewsCategory)
    : "general";

  const validLocale = locale === "th" ? "th" : "en";
  const cacheKey = `news:${category}:${country}:${validLocale}`;

  const getCached = unstable_cache(
    () => fetchNews(category, country, validLocale),
    [cacheKey],
    { revalidate: 900 }
  );

  try {
    const data = await getCached();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { articles: [], providers: [], summary: null, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
