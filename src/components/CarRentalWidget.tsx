"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

type WidgetProvider = "localrent" | "economybookings" | "qeeq";

interface WidgetConfig {
  provider: WidgetProvider;
  /** Localrent: pre-selects the country in the widget UI */
  countryId: number;
  /** Widget display language */
  lang: string;
}

const LOCALE_CONFIG: Record<string, WidgetConfig> = {
  th:      { provider: "localrent",       countryId: 9,  lang: "th" },
  es:      { provider: "economybookings", countryId: 23, lang: "es" },
  ru:      { provider: "economybookings", countryId: 23, lang: "ru" },
  "pt-BR": { provider: "economybookings", countryId: 23, lang: "pt" },
  fr:      { provider: "economybookings", countryId: 23, lang: "fr" },
  ja:      { provider: "qeeq",            countryId: 23, lang: "ja" },
  zh:      { provider: "localrent",       countryId: 23, lang: "zh" },
  "zh-TW": { provider: "localrent",       countryId: 23, lang: "zh" },
  ar:      { provider: "localrent",       countryId: 23, lang: "ar" },
  de:      { provider: "localrent",       countryId: 23, lang: "de" },
  id:      { provider: "localrent",       countryId: 23, lang: "id" },
  ko:      { provider: "localrent",       countryId: 23, lang: "ko" },
  it:      { provider: "localrent",       countryId: 23, lang: "it" },
  vi:      { provider: "localrent",       countryId: 23, lang: "vi" },
  en:      { provider: "localrent",       countryId: 23, lang: "en" },
};

const FALLBACK: WidgetConfig = { provider: "localrent", countryId: 23, lang: "en" };

function buildSrc({ provider, countryId, lang }: WidgetConfig): string {
  const base = "https://tpscr.com/content?trs=535682&shmarker=735444";
  switch (provider) {
    case "localrent":
      return `${base}&locale=${lang}&country=${countryId}&powered_by=true&campaign_id=87&promo_id=2466`;
    case "economybookings":
      return `${base}&locale=${lang}&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&color_text=%23000000&color_input_text=%23000000&color_button_text=%23ffffff&promo_id=4480&campaign_id=10`;
    case "qeeq":
      return `${base}&locale=${lang}&powered_by=true&campaign_id=172&promo_id=4850`;
  }
}

function WidgetSkeleton() {
  return (
    <div className="w-full rounded-xl bg-slate-100 animate-pulse" style={{ minHeight: 220 }} />
  );
}

export function CarRentalWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedSrcRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const locale = useLocale();
  const config = LOCALE_CONFIG[locale] ?? FALLBACK;
  const [visible, setVisible] = useState(false);

  // Observe scroll-into-view before loading the widget script
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "300px" } // start loading 300px before entering viewport
    );
    observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, []);

  // Inject widget script once visible
  useEffect(() => {
    if (!visible) return;
    const container = containerRef.current;
    if (!container) return;

    const src = buildSrc(config);
    if (loadedSrcRef.current === src) return;

    container.innerHTML = "";
    loadedSrcRef.current = src;

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = src;
    container.appendChild(script);
  }, [visible, config]);

  return (
    <div ref={containerRef} className="w-full">
      {!visible && <WidgetSkeleton />}
    </div>
  );
}
