"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

const LINKS = [
  {
    href: "https://s.lazada.co.th/s.ZhTKMF?c=b&t=p-i6RvCVf-sRab381",
    label: "🛍️ ช้อปสินค้าแนะนำ",
    sub: "ดีลพิเศษวันนี้",
  },
  {
    href: "https://s.lazada.co.th/s.ZhTKLe?c=a&t=p-iHa6GOt-s2EYQBV0",
    label: "⚡ Flash Sale",
    sub: "ลดราคาสูงสุด 90%",
  },
] as const;

export function LazadaFloatingAd() {
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (locale !== "th" || dismissed) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 w-52"
      role="complementary"
      aria-label="โฆษณา Lazada"
    >
      <div className="rounded-2xl border border-orange-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-orange-500 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-white tracking-tight">Lazada</span>
            <span className="rounded bg-orange-300/40 px-1 text-[10px] font-semibold text-white">
              Sponsored
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="ปิดโฆษณา"
            className="text-white/70 hover:text-white transition-colors leading-none text-lg"
          >
            ×
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col divide-y divide-orange-50">
          {LINKS.map(({ href, label, sub }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex flex-col px-3 py-2.5 hover:bg-orange-50 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-800">{label}</span>
              <span className="text-xs text-orange-500">{sub}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
