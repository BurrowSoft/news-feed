"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProviderResult } from "@/app/api/news/route";

interface Props {
  providers: string[];
  results: ProviderResult[] | null;
  visible: boolean;
}

export function NewsLoadingOverlay({ providers, results, visible }: Props) {
  const t = useTranslations("article");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!visible) return;
    setOpacity(1);
  }, [visible]);

  useEffect(() => {
    if (results !== null) {
      const timer = setTimeout(() => setOpacity(0), 600);
      return () => clearTimeout(timer);
    }
  }, [results]);

  if (!visible && opacity === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500"
      style={{ opacity }}
      aria-live="polite"
      aria-label="Loading news"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 px-8 py-6 shadow-2xl">
        <p className="mb-4 text-center text-sm font-semibold text-slate-300 tracking-wide uppercase">
          Fetching latest news
        </p>
        <ul className="space-y-3">
          {providers.map((name) => {
            const result = results?.find((r) => r.name === name);
            const settled = results !== null;

            return (
              <li key={name} className="flex items-center gap-3 text-sm">
                {settled ? (
                  result?.error ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-600 text-slate-400 text-xs">
                      ✕
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">
                      ✓
                    </span>
                  )
                ) : (
                  <span className="h-5 w-5 shrink-0 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                )}
                <span
                  className={
                    settled && result?.error
                      ? "text-slate-500"
                      : "text-slate-200"
                  }
                >
                  {settled && result?.error
                    ? t("unavailable", { provider: name })
                    : t("loading", { provider: name })}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
