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
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [providerResults, setProviderResults] = useState<ProviderResult[] | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(
    async (cat: NewsCategory) => {
      setOverlayVisible(true);
      setProviderResults(null);
      setSummary(null);
      setLoading(true);

      try {
        const res = await fetch(
          `/api/news?category=${cat}&country=${country}&locale=${locale}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: { articles: NewsArticle[]; providers: ProviderResult[]; summary: AISummary | null } =
          await res.json();
        setArticles(data.articles);
        setProviderResults(data.providers);
        setSummary(data.summary ?? null);

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
    if (cat === category) return;
    setCategory(cat);
    fetchNews(cat);
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

      <AISummaryCard summary={summary} loading={loading} />

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
