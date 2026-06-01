import Image from "next/image";
import type { Article } from "@/lib/news";

export function NewsCard({ article }: { article: Article }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {article.urlToImage && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {article.source.name}
          </span>
          <time className="shrink-0 text-xs text-slate-400">{date}</time>
        </div>
        <h2 className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-2 text-xs text-slate-500">
            {article.description}
          </p>
        )}
      </div>
    </a>
  );
}
