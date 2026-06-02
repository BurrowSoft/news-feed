"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { locale: "en", label: "EN", flag: "🇬🇧" },
  { locale: "th", label: "TH", flag: "🇹🇭" },
] as const;

interface Props {
  currentLocale: string;
}

export function LanguageSelector({ currentLocale }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium"
      aria-label="Language selector"
    >
      {OPTIONS.map(({ locale, label, flag }) => (
        <button
          key={locale}
          onClick={() => selectLocale(locale)}
          disabled={isPending}
          aria-pressed={currentLocale === locale}
          className={[
            "flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors",
            currentLocale === locale
              ? "bg-indigo-600 text-white"
              : "text-slate-500 hover:text-indigo-600",
          ].join(" ")}
        >
          <span aria-hidden>{flag}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
