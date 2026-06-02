"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
      <button
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
          locale === "en"
            ? "bg-rose-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => switchLocale("th")}
        aria-pressed={locale === "th"}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
          locale === "th"
            ? "bg-rose-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        🇹🇭 TH
      </button>
    </div>
  );
}
