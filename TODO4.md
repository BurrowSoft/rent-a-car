# RentACarMole — TODO4: Thailand/SEA Region-Specific APIs

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports4.md when done.

## Overview
Car rental in Thailand is a fragmented market — no single dominant API covers it well. The best approach is layered: (1) RentSyst free broker API for local/regional inventory, (2) Avis affiliate for international chains, (3) enhanced affiliate redirect grid with Thai-specific providers.

The existing Booking.com cars endpoint is broken (known issue). The multi-affiliate redirect fallback already covers Booking.com, Rentalcars, Kayak, and Expedia. This TODO adds Thai-specific options on top.

---

## What the user needs to arrange first

| Service | Registration | Notes |
|---|---|---|
| **RentSyst Broker API** | https://rentsyst.com/partners/ | Free API for aggregators. Real-time fleet + pricing. Covers Thailand operators. |
| **Avis Affiliate Program** | https://www.avisthailand.com/ or Avis global affiliate | Commission ~5%. Avis has strong presence in Bangkok/Phuket airports. |
| **Traveloka (optional)** | https://www.traveloka.com/en-en/car-rental | Super-app dominant in SEA. Affiliate or API access via partner program. |

New env vars to add to Vercel (rent-a-car project):
- `RENTSYST_API_KEY` (from rentsyst.com/partners)
- `NEXT_PUBLIC_AVIS_AFFILIATE_CODE` (from Avis affiliate program)
- `NEXT_PUBLIC_TRAVELOKA_AFFILIATE_ID` (from Traveloka partner program, optional)

---

## Tasks

### 1. RentSystCarProvider
File: `packages/shared/src/providers/cars/rentsyst.ts`

RentSyst Broker API:
- Base URL: `https://api.rentsyst.com/` (verify exact endpoints in their partner docs)
- Auth: API key in header
- Search: fleet availability by pickup location + dates
- Response: car model/category, price per day, supplier name, images, features
- Normalize to `RentalCar` DTO
- Gate on `process.env.RENTSYST_API_KEY` and country in SEA region
- Add to `createCarRouter()` in `packages/shared/src/providers/cars/index.ts`

### 2. Thai-specific affiliate providers in AffiliateCarSearch
File: `src/components/AffiliateCarSearch.tsx`

When country is `TH`, add these providers to the affiliate grid (in addition to or replacing less-relevant ones):

**Avis Thailand:**
```ts
{
  name: "Avis Thailand",
  description: "International brand, airport pickup guaranteed",
  buildUrl: (params) => `https://www.avisthailand.com/...?location=${params.pickupLocation}&...`,
  color: "bg-red-600 hover:bg-red-700"
}
```

**Traveloka (if affiliate ID set):**
```ts
{
  name: "Traveloka",
  description: "Popular super-app in Southeast Asia",
  buildUrl: (params) => `https://www.traveloka.com/en-th/car-rental/...`,
  color: "bg-blue-500 hover:bg-blue-600"
}
```

Make the affiliate provider list dynamic — accept a `country` prop in `AffiliateCarSearch` and render Thailand-specific providers when `country === "TH"`.

### 3. Pass country into AffiliateCarSearch
File: `src/components/ResultsClient.tsx`
- Accept `country` prop (passed from the results page server component via `detectCountry()`)
- Pass it to `<AffiliateCarSearch country={country} />`

### 4. Popular Thai pickup locations
Already in TODO3 — confirm these are in `POPULAR_LOCATIONS` in `src/lib/search.ts`:
- Suvarnabhumi Airport (BKK), Don Mueang (DMK), Phuket (HKT), Chiang Mai (CNX), Koh Samui (USM)

### 5. Sync packages/shared to all apps after changes
After editing any shared car provider file, copy `packages/shared/` to: flight-booking, hotel-booking, news-feed, main-website, games, shopping.
