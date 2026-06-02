"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export interface ProviderStatus {
  name: string;
  status: "loading" | "done" | "unavailable";
  count?: number;
}

interface Props {
  isVisible: boolean;
  providers: ProviderStatus[];
  message?: string;
}

export function CarLoadingOverlay({ isVisible, providers, message }: Props) {
  const t = useTranslations("overlay");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(isVisible ? 1 : 0);
  }, [isVisible]);

  if (!isVisible && opacity === 0) return null;

  const allSettled =
    providers.length > 0 &&
    providers.every((p) => p.status === "done" || p.status === "unavailable");

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-500"
      style={{ opacity }}
      aria-live="polite"
      aria-label="Loading car results"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-5 flex items-center gap-3">
          <span className="text-2xl">🚗</span>
          <p className="text-sm font-semibold text-slate-700">
            {message ?? t("searching")}
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="flex items-center gap-3 py-1">
            <Spinner />
            <span className="text-sm text-slate-500">{t("contacting")}</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {providers.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                {p.status === "loading" && <Spinner />}
                {p.status === "done" && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600">
                    ✓
                  </span>
                )}
                {p.status === "unavailable" && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                    –
                  </span>
                )}
                <span
                  className={
                    p.status === "loading"
                      ? "text-sm text-slate-700"
                      : p.status === "done"
                        ? "text-sm text-emerald-700"
                        : "text-sm text-slate-400"
                  }
                >
                  {p.status === "loading" && t("loading", { provider: p.name })}
                  {p.status === "done" &&
                    `${t("done", { provider: p.name })}${p.count != null ? ` — ${p.count}` : ""}`}
                  {p.status === "unavailable" && t("unavailable", { provider: p.name })}
                </span>
              </li>
            ))}
          </ul>
        )}

        {allSettled && (
          <p className="mt-4 text-xs text-slate-400">{t("preparing")}</p>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 shrink-0 animate-spin text-rose-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
