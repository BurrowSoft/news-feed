"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@burrowsoft/shared";

function encodeArticleId(url: string): string {
  // encodeURIComponent handles non-ASCII; btoa is available in both browser and Node 18+
  return btoa(encodeURIComponent(url))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function NewsCard({ article }: { article: NewsArticle }) {
  const t = useTranslations("article");

  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const articleId = encodeArticleId(article.url);
  const qs = new URLSearchParams({
    title: article.title,
    source: article.source,
    publishedAt: article.publishedAt,
    provider: article.provider,
    ...(article.description ? { description: article.description } : {}),
    ...(article.imageUrl ? { imageUrl: article.imageUrl } : {}),
  });
  const detailHref = `/article/${articleId}?${qs.toString()}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {article.imageUrl ? (
        <Link href={detailHref} className="block">
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        </Link>
      ) : (
        <div className="h-32 w-full bg-slate-100 flex items-center justify-center">
          <span className="text-3xl select-none" aria-hidden>📰</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {article.source}
          </span>
          <time className="shrink-0 text-xs text-slate-400">{date}</time>
        </div>

        <Link href={detailHref} className="block">
          <h2 className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors">
            {article.title}
          </h2>
        </Link>

        {article.description && (
          <p className="line-clamp-2 text-xs text-slate-500">{article.description}</p>
        )}

        <div className="mt-auto pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {t("readOn", { source: article.source })}
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.5 9.5 9.5 2.5M5.5 2.5h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
