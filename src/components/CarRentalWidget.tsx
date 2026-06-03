"use client";

import { useEffect, useRef } from "react";

type WidgetProvider = "localrent" | "economybookings" | "qeeq" | "autoeurope";

interface WidgetConfig {
  provider: WidgetProvider;
  locale: string;
  countryId?: number; // Localrent only
}

/** Country → widget provider + locale. Drives both provider selection and language. */
const COUNTRY_CONFIG: Record<string, WidgetConfig> = {
  TH: { provider: "localrent",       locale: "th",    countryId: 9  },
  ES: { provider: "economybookings", locale: "es"                    },
  RU: { provider: "economybookings", locale: "ru"                    },
  BR: { provider: "economybookings", locale: "pt_BR"                 },
  FR: { provider: "economybookings", locale: "fr"                    },
  JP: { provider: "qeeq",            locale: "jp"                    },
  MX: { provider: "qeeq",            locale: "es"                    },
  FI: { provider: "autoeurope",      locale: "fi"                    },
  PL: { provider: "autoeurope",      locale: "pl"                    },
  GB: { provider: "autoeurope",      locale: "en"                    },
  US: { provider: "autoeurope",      locale: "en"                    },
};

const FALLBACK: WidgetConfig = { provider: "localrent", locale: "en", countryId: 23 };

function buildSrc(config: WidgetConfig): string {
  const base = "https://tpscr.com/content?trs=535682&shmarker=735444";
  switch (config.provider) {
    case "localrent":
      return `${base}&locale=${config.locale}&country=${config.countryId}&powered_by=true&campaign_id=87&promo_id=2466`;
    case "economybookings":
      return `${base}&locale=${config.locale}&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&color_text=%23000000&color_input_text=%23000000&color_button_text=%23ffffff&promo_id=4480&campaign_id=10`;
    case "qeeq":
      return `${base}&locale=${config.locale}&powered_by=true&campaign_id=172&promo_id=4850`;
    case "autoeurope":
      return `${base}&locale=${config.locale}&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&promo_id=4362&campaign_id=143`;
  }
}

interface Props {
  /** ISO-3166-1 alpha-2 country code from detectCountry(), e.g. "TH", "US", "GB" */
  country: string;
}

export function CarRentalWidget({ country }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = COUNTRY_CONFIG[country] ?? FALLBACK;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = buildSrc(config);
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [config.provider, config.locale]);

  return <div ref={containerRef} className="w-full" />;
}

/** Returns true when the country maps to Localrent (full-page widget, no hero needed). */
export function isLocalrentCountry(country: string): boolean {
  const config = COUNTRY_CONFIG[country] ?? FALLBACK;
  return config.provider === "localrent";
}
