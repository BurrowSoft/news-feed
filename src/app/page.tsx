import { headers } from "next/headers";
import { getTopHeadlines } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { detectCountry } from "@burrowsoft/shared";

export const revalidate = 900;

export default async function HomePage() {
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const articles = await getTopHeadlines(country, 30);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{SITE_NAME}</h1>
        <p className="mt-1 text-slate-500">{SITE_DESCRIPTION}</p>
      </div>

      {articles.length === 0 ? (
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
    </div>
  );
}
