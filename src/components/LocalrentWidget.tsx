"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

/** Travelpayouts country IDs for the Localrent widget */
const COUNTRY_IDS: Record<string, number> = {
  TH: 9,
  US: 23,
};

interface Props {
  /** ISO-3166-1 alpha-2 country code from detectCountry(), e.g. "TH", "US" */
  country: string;
  /** "header" = compact search bar; "main" = full listing with filters */
  variant: "header" | "main";
}

export function LocalrentWidget({ country, variant }: Props) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const countryId = COUNTRY_IDS[country] ?? 23;
  const lang = locale === "th" ? "th" : "en";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";

    if (variant === "header") {
      script.src = `https://tpscr.com/content?trs=535682&shmarker=735444&powered_by=true&country=${countryId}&lang=${lang}&width=100&background=light&logo=true&header=true&gearbox=false&cars=false&border=true&footer=true&campaign_id=87&promo_id=4322`;
    } else {
      script.src = `https://tpscr.com/content?trs=535682&shmarker=735444&locale=${lang}&country=${countryId}&powered_by=true&campaign_id=87&promo_id=2466`;
    }

    container.appendChild(script);

    return () => {
      if (container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [countryId, lang, variant]);

  return <div ref={containerRef} className="w-full" />;
}
