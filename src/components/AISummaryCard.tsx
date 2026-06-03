"use client";

import { useTranslations } from "next-intl";
import type { AISummary } from "@burrowsoft/shared";

interface Props {
  summary: AISummary | null;
  loading: boolean;
  activeHighlight?: string | null;
  onHighlightClick?: (text: string) => void;
}

export function AISummaryCard({ summary, loading, activeHighlight, onHighlightClick }: Props) {
  const t = useTranslations("article");

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 animate-pulse">
        <div className="mb-3 h-4 w-32 rounded bg-indigo-200/70" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-indigo-200/50" />
          <div className="h-3 w-5/6 rounded bg-indigo-200/50" />
          <div className="h-3 w-4/6 rounded bg-indigo-200/50" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-24 rounded-full bg-indigo-200/60" />
          <div className="h-5 w-20 rounded-full bg-indigo-200/60" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          {t("aiSummary")}
        </span>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
          {t("poweredBy")}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">{summary.summary}</p>

      {summary.highlights.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {summary.highlights.map((h, i) => {
            const isActive = activeHighlight === h;
            return (
              <li key={i}>
                <button
                  onClick={() => onHighlightClick?.(h)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    onHighlightClick ? "cursor-pointer" : "cursor-default",
                    isActive
                      ? "border-indigo-400 bg-indigo-600 text-white"
                      : "border-indigo-200 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700",
                  ].join(" ")}
                >
                  {h}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {summary.countryNote && (
        <p className="mt-3 text-xs text-slate-400 italic">{summary.countryNote}</p>
      )}
    </div>
  );
}
