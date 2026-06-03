# RentACarMole — TODO6: Replace Search with Localrent Travelpayouts Widget

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports6.md when done.

## Overview
The current rent-a-car search returns no results (Booking.com cars API is broken). Replace the entire search UI with two Travelpayouts Localrent widgets — a header/search widget and a full listing widget. These work for all users globally, pre-filtered by detected country.

---

## Widget scripts

**Header/search widget** (compact search form at top of page):
```html
<script async src="https://tpscr.com/content?trs=535682&shmarker=735444&powered_by=true&country={COUNTRY_ID}&lang={LANG}&width=100&background=light&logo=true&header=true&gearbox=false&cars=false&border=true&footer=true&campaign_id=87&promo_id=4322" charset="utf-8"></script>
```

**Main listing widget** (full car listing with filters):
```html
<script async src="//tpscr.com/content?trs=535682&shmarker=735444&locale={LANG}&country={COUNTRY_ID}&powered_by=true&campaign_id=87&promo_id=2466" charset="utf-8"></script>
```

---

## Country ID mapping

| Country | ID |
|---|---|
| Thailand (TH) | 9 |
| United States (US) | 23 |
| **All others** | 23 (US as fallback) |

---

## Implementation

### 1. Create `src/components/LocalrentWidget.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

const COUNTRY_IDS: Record<string, number> = {
  TH: 9,
  US: 23,
};

interface Props {
  country: string;   // ISO code from detectCountry(), e.g. "TH", "US"
  variant: "header" | "main";
}

export function LocalrentWidget({ country, variant }: Props) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const countryId = COUNTRY_IDS[country] ?? 23;
  const lang = locale === "th" ? "th" : "en";

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";

    if (variant === "header") {
      script.src = `https://tpscr.com/content?trs=535682&shmarker=735444&powered_by=true&country=${countryId}&lang=${lang}&width=100&background=light&logo=true&header=true&gearbox=false&cars=false&border=true&footer=true&campaign_id=87&promo_id=4322`;
    } else {
      script.src = `https://tpscr.com/content?trs=535682&shmarker=735444&locale=${lang}&country=${countryId}&powered_by=true&campaign_id=87&promo_id=2466`;
    }

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current?.contains(script)) {
        containerRef.current.removeChild(script);
      }
    };
  }, [countryId, lang, variant]);

  return <div ref={containerRef} className="w-full" />;
}
```

### 2. Update the main page (`src/app/page.tsx`)

The page is a server component — read country from headers, pass to widget:

```tsx
import { headers } from "next/headers";
import { detectCountry } from "@burrowsoft/shared";
import { LocalrentWidget } from "@/components/LocalrentWidget";

export default async function HomePage() {
  const country = detectCountry(await headers());

  return (
    <main>
      {/* Replace existing search form with header widget */}
      <LocalrentWidget country={country} variant="header" />

      {/* Replace existing results list with main listing widget */}
      <LocalrentWidget country={country} variant="main" />
    </main>
  );
}
```

### 3. Remove or hide old search UI
- The existing `SearchForm`, `ResultsClient`, `AffiliateCarSearch` components are no longer needed on the home page
- Keep them in the codebase (don't delete) — they may still be used on `/results` page
- Just don't render them on the home page `page.tsx`

### 4. Keep AffiliateCarSearch as fallback
On the `/results` page (if it still exists), keep `AffiliateCarSearch` visible below the widget so users have additional booking options.

---

## Verify
- TH locale: widget loads in Thai (`lang=th`), pre-filtered to Thailand (`country=9`)
- All other countries: widget loads in English, pre-filtered to US (`country=23`)
- No JS errors in console
- Both widgets render — header form + main listing
- Commission tracking: `shmarker=735444` is your affiliate marker — bookings through the widget earn 7.5–12% commission

## Commit and push + fill Reports6.md
