import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

function decodeArticleId(id: string): string {
  const base64 = id.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  // Encoded with btoa(encodeURIComponent(url)) in NewsCard — reverse with decodeURIComponent(atob())
  return decodeURIComponent(atob(padded));
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    title?: string;
    source?: string;
    publishedAt?: string;
    provider?: string;
    description?: string;
    imageUrl?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: sp.title ?? "Article",
    description: sp.description,
    openGraph: {
      title: sp.title,
      description: sp.description ?? undefined,
      images: sp.imageUrl ? [{ url: sp.imageUrl }] : [],
    },
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const articleUrl = decodeArticleId(id);
  const publishedDate = sp.publishedAt
    ? new Date(sp.publishedAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to {SITE_NAME}
      </Link>

      <article>
        {sp.imageUrl && (
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-80">
            <Image
              src={sp.imageUrl}
              alt={sp.title ?? "Article image"}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {sp.source && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {sp.source}
            </span>
          )}
          {sp.provider && sp.provider !== sp.source && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              via {sp.provider}
            </span>
          )}
          {publishedDate && (
            <time className="text-sm text-slate-400">{publishedDate}</time>
          )}
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
          {sp.title ?? "Article"}
        </h1>

        {sp.description && (
          <p className="mb-8 text-base leading-relaxed text-slate-600">{sp.description}</p>
        )}

        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          Read full article on {sp.source ?? "source"}
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3.5 12.5 12.5 3.5M7.5 3.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </article>
    </div>
  );
}
