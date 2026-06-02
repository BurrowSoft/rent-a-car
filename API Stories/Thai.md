# RentACarMole — Thailand Car Rental API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Service | Registration | Notes |
|---|---|---|
| **RentSyst Broker API** | https://rentsyst.com/partners/ | Free API. Real-time fleet + pricing. Covers Thai operators. |
| **Avis Thailand affiliate** | https://www.avisthailand.com/ | ~5% commission. Strong airport presence (Bangkok, Phuket). |
| **Traveloka (optional)** | https://www.traveloka.com | Super-app dominant in SEA. Affiliate/API via partner program. |

New env vars: `RENTSYST_API_KEY`, `NEXT_PUBLIC_AVIS_AFFILIATE_CODE`, `NEXT_PUBLIC_TRAVELOKA_AFFILIATE_ID`.

## Tasks

### 1. RentSystCarProvider
File: `packages/shared/src/providers/cars/rentsyst.ts`
- Gate on `process.env.RENTSYST_API_KEY` + country in SEA
- Normalize to `RentalCar` DTO
- Add to `createCarRouter()`

### 2. AffiliateCarSearch — Thai providers
When `country === "TH"`, add to provider grid:
- **Avis Thailand** — `https://www.avisthailand.com/...`
- **Traveloka** (if affiliate ID set) — `https://www.traveloka.com/en-th/car-rental/...`

### 3. Pass country to AffiliateCarSearch
`ResultsClient.tsx` → accept `country` prop → pass to `<AffiliateCarSearch country={country} />`

### 4. Popular Thai pickup locations (confirm in search.ts)
BKK (Suvarnabhumi), DMK (Don Mueang), HKT (Phuket), CNX (Chiang Mai), USM (Koh Samui)
