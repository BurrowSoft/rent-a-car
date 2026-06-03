"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_NAMES } from "@burrowsoft/shared";

export function LocaleSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => {
      router.replace(pathname, { locale: e.target.value });
    });
  }

  return (
    <select
      value={locale}
      onChange={onChange}
      disabled={isPending}
      aria-label="Select language"
      className="text-sm border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-50"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAMES[l as keyof typeof LOCALE_NAMES] ?? l}
        </option>
      ))}
    </select>
  );
}
