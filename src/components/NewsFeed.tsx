"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsCard } from "./NewsCard";
import { NewsLoadingOverlay } from "./NewsLoadingOverlay";
import { AISummaryCard } from "./AISummaryCard";
import type { NewsArticle, NewsCategory, AISummary } from "@burrowsoft/shared";
import type { ProviderResult } from "@/app/api/news/route";

const CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: "general", label: "Top Stories" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
];

const KNOWN_PROVIDERS = ["GNews", "The Guardian", "NewsAPI"];

interface Props {
  country: string;
}

export function NewsFeed({ country }: Props) {
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
        const res = await fetch(`/api/news?category=${cat}&country=${country}`);
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
    [country]
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

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(({ value, label }) => (
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
            {label}
          </button>
        ))}
      </div>

      <AISummaryCard summary={summary} loading={loading} />

      {!loading && articles.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
          No headlines available right now. Check back soon.
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
