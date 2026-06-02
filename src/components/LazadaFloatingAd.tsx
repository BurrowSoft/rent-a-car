"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

const ADS = [
  {
    href: "https://s.lazada.co.th/s.ZhTKMF?c=b&t=p-i6RvCVf-sRab381",
    label: "ช้อปที่ Lazada",
    sub: "ดีลพิเศษวันนี้ 🛍️",
  },
  {
    href: "https://s.lazada.co.th/s.ZhTKLe?c=a&t=p-iHa6GOt-s2EYQBV0",
    label: "โปรโมชั่น Lazada",
    sub: "ลดราคาสูงสุด 🎁",
  },
];

export function LazadaFloatingAd() {
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (locale !== "th" || dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-50 w-56 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden"
      role="complementary"
      aria-label="Lazada promotion"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#f57224] px-3 py-2">
        <div className="flex items-center gap-1.5">
          {/* Lazada wordmark in white */}
          <span className="text-sm font-extrabold text-white tracking-tight">lazada</span>
          <span className="rounded bg-white/20 px-1 text-[10px] font-semibold text-white">TH</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="ปิดโฆษณา"
          className="rounded p-0.5 text-white/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Ad links */}
      <div className="p-2 space-y-1.5">
        {ADS.map((ad) => (
          <a
            key={ad.href}
            href={ad.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 transition-colors hover:bg-orange-100 active:bg-orange-200"
          >
            <span className="text-lg" aria-hidden>🏷️</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-tight">{ad.label}</p>
              <p className="text-[11px] text-orange-600 leading-tight">{ad.sub}</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0">↗</span>
          </a>
        ))}
        <p className="text-center text-[10px] text-slate-300 pt-0.5">โฆษณา · Sponsored</p>
      </div>
    </div>
  );
}
