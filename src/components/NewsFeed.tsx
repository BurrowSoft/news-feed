"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { NewsCard } from "./NewsCard";
import { NewsLoadingOverlay } from "./NewsLoadingOverlay";
import { AISummaryCard } from "./AISummaryCard";
import type { NewsArticle, NewsCategory, AISummary } from "@burrowsoft/shared";
import type { ProviderResult } from "@/app/api/news/route";

type CategoryKey = "top" | "business" | "technology" | "sports" | "entertainment" | "health" | "science";

const CATEGORY_MAP: { value: NewsCategory; key: CategoryKey }[] = [
  { value: "general", key: "top" },
  { value: "business", key: "business" },
  { value: "technology", key: "technology" },
  { value: "sports", key: "sports" },
  { value: "entertainment", key: "entertainment" },
  { value: "health", key: "health" },
  { value: "science", key: "science" },
];

const KNOWN_PROVIDERS = ["GNews", "The Guardian", "NewsAPI"];

interface Props {
  country: string;
  locale: string;
}

export function NewsFeed({ country, locale }: Props) {
  const t = useTranslations("categories");
  const tArticle = useTranslations("article");

  const [category, setCategory] = useState<NewsCategory>("general");
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [providerResults, setProviderResults] = useState<ProviderResult[] | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(
    async (cat: NewsCategory, query?: string) => {
      setOverlayVisible(true);
      setProviderResults(null);
      // Keep existing summary visible during query searches — it's still relevant context
      if (!query) setSummary(null);
      setLoading(true);

      try {
        const url = new URL("/api/news", window.location.origin);
        url.searchParams.set("category", cat);
        url.searchParams.set("country", country);
        url.searchParams.set("locale", locale);
        if (query) url.searchParams.set("q", query);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("fetch failed");
        const data: { articles: NewsArticle[]; providers: ProviderResult[]; summary: AISummary | null } =
          await res.json();
        setArticles(data.articles);
        setProviderResults(data.providers);
        if (data.summary !== null) setSummary(data.summary);

        setTimeout(() => {
          setOverlayVisible(false);
          setLoading(false);
        }, 900);
      } catch {
        setProviderResults(KNOWN_PROVIDERS.map((name) => ({ name, count: 0, error: true })));
        setTimeout(() => {
          setOverlayVisible(false);
          setLoading(false);
        }, 900);
      }
    },
    [country, locale]
  );

  useEffect(() => {
    fetchNews("general");
  }, [fetchNews]);

  function handleCategoryChange(cat: NewsCategory) {
    if (cat === category && !activeHighlight) return;
    setCategory(cat);
    setActiveHighlight(null);
    fetchNews(cat);
  }

  function handleHighlightClick(text: string) {
    const next = activeHighlight === text ? null : text;
    setActiveHighlight(next);
    if (next) {
      fetchNews(category, next);
    } else {
      fetchNews(category);
    }
  }

  return (
    <>
      <NewsLoadingOverlay
        providers={KNOWN_PROVIDERS}
        results={providerResults}
        visible={overlayVisible}
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_MAP.map(({ value, key }) => (
          <button
            key={value}
            onClick={() => handleCategoryChange(value)}
            className={[
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              category === value
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
            ].join(" ")}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <AISummaryCard
        summary={summary}
        loading={loading}
        activeHighlight={activeHighlight}
        onHighlightClick={handleHighlightClick}
      />

      {activeHighlight && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-slate-500">Showing results for:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
            {activeHighlight}
            <button
              onClick={() => handleHighlightClick(activeHighlight)}
              aria-label="Clear search"
              className="rounded-full hover:opacity-75 transition-opacity leading-none"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {!loading && articles.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
          {tArticle("noneFound")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
