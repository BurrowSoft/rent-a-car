"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

type WidgetProvider = "localrent" | "economybookings" | "qeeq" | "autoeurope";

interface WidgetConfig {
  provider: WidgetProvider;
  countryId?: number; // Localrent only
}

const COUNTRY_CONFIG: Record<string, WidgetConfig> = {
  TH: { provider: "localrent",       countryId: 9  },
  ES: { provider: "economybookings"                 },
  RU: { provider: "economybookings"                 },
  BR: { provider: "economybookings"                 },
  FR: { provider: "economybookings"                 },
  JP: { provider: "qeeq"                            },
  MX: { provider: "qeeq"                            },
  FI: { provider: "autoeurope"                      },
  PL: { provider: "autoeurope"                      },
  GB: { provider: "autoeurope"                      },
  US: { provider: "autoeurope"                      },
};

const FALLBACK: WidgetConfig = { provider: "localrent", countryId: 23 };

// Map next-intl locale → widget locale (explicit dropdown selection)
const WIDGET_LOCALE: Record<string, string> = {
  en: "en", th: "th", es: "es", ru: "ru",
  "pt-BR": "pt", fr: "fr", ja: "ja", zh: "zh",
  "zh-TW": "zh", ar: "ar", de: "de", id: "id",
  ko: "ko", it: "it", vi: "vi",
};

// ISO country → native widget locale (used when dropdown defaulted to English)
const COUNTRY_NATIVE_LOCALE: Record<string, string> = {
  FI: "fi", PL: "pl", DE: "de", AT: "de", CH: "de",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  BR: "pt", PT: "pt",
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru",
  JP: "ja", CN: "zh", TW: "zh", HK: "zh",
  KR: "ko", ID: "id", VN: "vi", TH: "th",
  IT: "it", NL: "nl", SE: "sv", NO: "no", DK: "da",
  SA: "ar", AE: "ar", EG: "ar",
};

function buildSrc(config: WidgetConfig, locale: string): string {
  const base = "https://tpscr.com/content?trs=535682&shmarker=735444";
  switch (config.provider) {
    case "localrent":
      return `${base}&locale=${locale}&country=${config.countryId}&powered_by=true&campaign_id=87&promo_id=2266`;
    case "economybookings":
      return `${base}&locale=${locale}&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&color_text=%23000000&color_input_text=%23000000&color_button_text=%23ffffff&promo_id=4480&campaign_id=10`;
    case "qeeq":
      return `${base}&locale=${locale}&powered_by=true&campaign_id=172&promo_id=4850`;
    case "autoeurope":
      return `${base}&locale=${locale}&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&promo_id=4362&campaign_id=143`;
  }
}

/** Resolve widget locale:
 * 1. User picked non-English from dropdown → follow that exactly
 * 2. App defaulted to English (user's language not in dropdown) → use country's native language
 * 3. Last resort: browser language, then "en" */
function resolveWidgetLocale(appLocale: string, country: string): string {
  const mapped = WIDGET_LOCALE[appLocale];
  if (mapped && mapped !== "en") return mapped;
  // English or fallback — derive from country so FI→fi, PL→pl regardless of tester's browser
  return COUNTRY_NATIVE_LOCALE[country] ?? navigator?.language?.split(/[-_]/)[0] ?? "en";
}

interface Props {
  country: string; // ISO-3166-1 alpha-2 from detectCountry()
}

export function CarRentalWidget({ country }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appLocale = useLocale();
  const widgetLocale = resolveWidgetLocale(appLocale, country);
  const config = COUNTRY_CONFIG[country] ?? FALLBACK;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = buildSrc(config, widgetLocale);
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [config.provider, widgetLocale]);

  return <div ref={containerRef} className="w-full" />;
}
