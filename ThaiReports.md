# RentACarMole — Thai Localisation Coverage Report

## Translation coverage as of TODO4 (2026-06-03)

### Namespaces

| Namespace | EN | TH | Notes |
|---|---|---|---|
| `nav` | ✅ | ✅ | Home link, header tagline |
| `hero` | ✅ | ✅ | Title, subtitle, badge, 3 trust strips, 4 feature cards, popular section heading |
| `search` | ✅ | ✅ | All form labels + placeholders, age unit, submit button |
| `results` | ✅ | ✅ | Page header, count, specs (seats/doors/AC/luggage/transmission), price labels, CTAs |
| `affiliate` | ✅ | ✅ | Both empty and below variants, note |
| `overlay` | ✅ | ✅ | All loading/done/unavailable states |
| `footer` | ✅ | ✅ | Section headings, copyright |

### Components translated

| Component | Translated | Method |
|---|---|---|
| `layout.tsx` | ✅ | `getTranslations("footer")` + `getTranslations("nav")` |
| `page.tsx` | ✅ | `getTranslations("hero")` |
| `SearchForm.tsx` | ✅ | `useTranslations("search")` |
| `CarLoadingOverlay.tsx` | ✅ | `useTranslations("overlay")` |
| `CarResultCard.tsx` | ✅ | `useTranslations("results")` |
| `ResultsClient.tsx` | ✅ | `useTranslations("results")` + `useTranslations("overlay")` |
| `AffiliateCarSearch.tsx` | ✅ | `useTranslations("affiliate")` |
| `LanguageSelector` | N/A | Shared component from `@burrowsoft/shared` |

### Thai-specific features

- **Language selector**: EN / TH dropdown (shared `LanguageSelector` component) in header nav
- **Font**: Sarabun (Thai + Latin subsets, weights 400/600/700) applied via `<html>` className when `locale === "th"`
- **Auto-detection**: Thai users get `locale=th` automatically via `x-vercel-ip-country: TH` header
- **Popular locations**: Bangkok (BKK, DMK), Phuket (HKT), Chiang Mai (CNX), Koh Samui (USM)
- **Lazada floating ad**: Bottom-right fixed banner shown only for Thai users (`locale === "th"`) with two Lazada Thailand promotional links. Dismissable.

### Strings NOT yet translated

- Affiliate provider descriptions inside `AffiliateCarSearch` ("500+ rental companies worldwide", etc.) — not in TODO scope, hardcoded in English
- Lazada ad labels are in Thai only (intentional — ad is Thailand-only)
- Place names in footer quick-links (New York, Paris, etc.) — proper nouns, intentionally EN
- `<html lang>` + `<title>` in metadata — locale-specific `metadata` would need an async layout export (currently static)

## API work (future)

Per TODO4 reference to `API Stories/Thai.md` — car rental APIs for the Thai market to consider:
- **Traveloka** — major Southeast Asian OTA, has car rental in Thailand. API available via partner program.
- **Avis Thailand** — direct API for Avis fleet; useful for airport pickups (BKK, HKT, CNX).
- **RentSyst** — car rental management API used by local Thai operators.
- **ZipCar** / **DriveNow** — not available in Thailand.
- **Grab Rental** — Grab app has car rental in Thailand; no public API.
- **Recommendation**: Contact Traveloka partner API team first — largest reach in TH market with good English-language documentation.
