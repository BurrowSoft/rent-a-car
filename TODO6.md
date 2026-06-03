# RentACarMole — TODO6: Replace Search with Travelpayouts Widgets (Multi-Provider)

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports6.md when done.

## Overview
The current rent-a-car search returns no results. Replace the entire search UI with Travelpayouts car rental widgets — provider selected by detected country. Commission: 7.5–12% (Localrent), 3–8% (Economybookings), varies (QEEQ, AutoEurope).

---

## Country → Widget mapping

| Widget | Countries (ISO) | Locale param |
|---|---|---|
| **Localrent** | TH + all others (fallback) | `th` or `en` |
| **Economybookings** | ES, RU, BR, FR | `es`, `ru`, `pt_BR`, `fr` |
| **QEEQ** | JP, MX | `jp`, `es` |
| **AutoEurope** | FI, PL, GB, US | `fi`, `pl`, `en`, `en` |

---

## Widget scripts (use `[LOCALE]` and `[COUNTRY_ID]` as placeholders — fill dynamically)

**Localrent** (Thailand country=9, all others country=23 as fallback):
```
https://tpscr.com/content?trs=535682&shmarker=735444&locale=[LOCALE]&country=[COUNTRY_ID]&powered_by=true&campaign_id=87&promo_id=2466
```

**Economybookings:**
```
https://tpscr.com/content?trs=535682&shmarker=735444&locale=[LOCALE]&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&color_text=%23000000&color_input_text=%23000000&color_button_text=%23ffffff&promo_id=4480&campaign_id=10
```

**QEEQ:**
```
https://tpscr.com/content?trs=535682&shmarker=735444&locale=[LOCALE]&powered_by=true&campaign_id=172&promo_id=4850
```

**AutoEurope:**
```
https://tpscr.com/content?trs=535682&shmarker=735444&locale=[LOCALE]&powered_by=true&border_radius=5&plain=true&show_logo=true&color_background=%230b2033&color_button=%23e8b917&promo_id=4362&campaign_id=143
```

---

## Implementation

### 1. Create `src/components/CarRentalWidget.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

type WidgetProvider = "localrent" | "economybookings" | "qeeq" | "autoeurope";

interface WidgetConfig {
  provider: WidgetProvider;
  locale: string;
  countryId?: number; // Localrent only
}

// Country → widget provider + locale
const COUNTRY_CONFIG: Record<string, WidgetConfig> = {
  TH: { provider: "localrent",       locale: "th",    countryId: 9  },
  ES: { provider: "economybookings", locale: "es"  },
  RU: { provider: "economybookings", locale: "ru"  },
  BR: { provider: "economybookings", locale: "pt_BR" },
  FR: { provider: "economybookings", locale: "fr"  },
  JP: { provider: "qeeq",            locale: "jp"  },
  MX: { provider: "qeeq",            locale: "es"  },
  FI: { provider: "autoeurope",      locale: "fi"  },
  PL: { provider: "autoeurope",      locale: "pl"  },
  GB: { provider: "autoeurope",      locale: "en"  },
  US: { provider: "autoeurope",      locale: "en"  },
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
  country: string; // ISO code from detectCountry()
}

export function CarRentalWidget({ country }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = COUNTRY_CONFIG[country] ?? FALLBACK;

  useEffect(() => {
    if (!containerRef.current) return;
    // Clear any previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = buildSrc(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [config.provider, config.locale]);

  return <div ref={containerRef} className="w-full" />;
}
```

### 2. `CarRentalWidget` — Localrent only renders the main listing widget (no header)
The Localrent listing widget is a complete standalone UI — no need for the separate header/search widget on top of it.
The `variant: "header"` concept is removed. Only one script is injected per country.

### 3. Update `src/app/page.tsx` — conditional hero background

The red hero background only makes sense for non-Localrent widgets (Economybookings, QEEQ, AutoEurope have their own compact UI that benefits from a branded wrapper). For Localrent, show no background — the widget is a complete page itself.

```tsx
import { headers } from "next/headers";
import { detectCountry } from "@burrowsoft/shared";
import { CarRentalWidget } from "@/components/CarRentalWidget";

// Helper to detect which provider will be used (mirrors COUNTRY_CONFIG logic)
function getProvider(country: string) {
  const economybookings = ["ES","RU","BR","FR"];
  const qeeq = ["JP","MX"];
  const autoeurope = ["FI","PL","GB","US"];
  if (economybookings.includes(country)) return "economybookings";
  if (qeeq.includes(country)) return "qeeq";
  if (autoeurope.includes(country)) return "autoeurope";
  return "localrent";
}

export default async function HomePage() {
  const country = detectCountry(await headers());
  const provider = getProvider(country);
  const isLocalrent = provider === "localrent";

  return (
    <>
      {/* Hero — only show for non-Localrent providers */}
      {!isLocalrent && (
        <section className="bg-rose-500 px-4 py-12 text-center text-white">
          {/* existing hero title, subtitle, trust badges */}
        </section>
      )}

      <main className={isLocalrent ? "w-full" : "mx-auto max-w-5xl px-4 py-8"}>
        <CarRentalWidget country={country} />
        <AffiliateCarSearch variant="below" params={{}} />
      </main>
    </>
  );
}
```

### 4. Hide old SearchForm on home page
Don't render `SearchForm` or `ResultsClient` on the home page — the widget replaces them. Keep the files; the `/results` route may still use them.

---

## Verify for each provider
- **TH locale**: Localrent widget, Thai language
- **ES**: Economybookings widget, Spanish
- **JP**: QEEQ widget, Japanese
- **FI**: AutoEurope widget, Finnish
- **US / fallback**: AutoEurope (US), English
- **Any unlisted country**: Localrent fallback, English

## Commit and push + fill Reports6.md

---

## Cleanup: remove junk sections from page.tsx

The Localrent widget replaces the entire search experience. The following sections in `src/app/page.tsx` are no longer needed and should be **deleted**:

- **Trust/feature cards** ("ผู้ให้บริการชั้นนำ", "ราคาดีที่สุด", "ไม่มีค่าธรรมเนียมซ่อน", "ยกเลิกฟรี") — fabricated trust badges, remove entirely
- **Popular destinations grid** ("จุดหมายยอดนิยม") — the IATA code cards (JFK, LAX, BKK, etc.) — remove entirely
- **Footer region link columns** (อเมริกา, ยุโรป, เอเชีย & แปซิฟิก with city links) — remove entirely

Keep only:
- The `<CarRentalWidget />` (the Localrent/multi-provider widget)
- The `<AffiliateCarSearch variant="below" />` if present
- The main site header and footer (nav + copyright)

The page should be clean: widget fills the viewport, nothing fake below it.
