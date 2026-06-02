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
  country: string
): Promise<NewsApiResponse> {
  const router = createNewsRouter();
  const providers = router.getProvidersForCountry(country);

  const pageSize = 30;
  const language = "en";
  const params = { pageSize, country, language, category };

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

  const summary = await summarize("news", articles, country);

  return { articles, providers: providerResults, summary };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const rawCategory = searchParams.get("category") ?? "general";
  const country = searchParams.get("country") ?? "US";

  const category: NewsCategory = VALID_CATEGORIES.has(rawCategory as NewsCategory)
    ? (rawCategory as NewsCategory)
    : "general";

  const cacheKey = `news:${category}:${country}`;

  const getCached = unstable_cache(
    () => fetchNews(category, country),
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
