# RentACarMole — TODO3: Thai Localisation + Language Selector

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports3.md when done.

## Overview
When a user visits from Thailand (`x-vercel-ip-country: TH`), the app defaults to Thai. Thailand is a major car rental market (Bangkok, Phuket, Chiang Mai). All users get a language selector (EN / TH) in the header.

## Architecture: `next-intl` with cookie-based locale (no URL changes)
- Install `next-intl`
- Messages: `src/messages/en.json` and `src/messages/th.json`
- Locale in `NEXT_LOCALE` cookie
- Locale detection: cookie → `detectCountry()` → TH defaults to `th`, else `en`

## Tasks

### 1. Install and configure next-intl
```bash
npm install next-intl
```
- `src/i18n.ts`, `src/middleware.ts`, wrap layout with `NextIntlClientProvider`

### 2. Translation files

**`src/messages/en.json`**
```json
{
  "nav": { "home": "RentACarMole" },
  "hero": { "title": "Compare Rental Cars. No Hidden Fees.", "subtitle": "Search across Booking.com, Rentalcars, Kayak and Expedia." },
  "search": {
    "pickup": "Pick-up location",
    "dropoff": "Drop-off location",
    "pickupDate": "Pick-up date",
    "dropoffDate": "Drop-off date",
    "driverAge": "Driver age",
    "search": "Search Cars",
    "sameLocation": "Return to same location"
  },
  "results": {
    "found": "{count} cars found",
    "noneFound": "No cars found.",
    "compareOn": "Compare on top sites",
    "findCars": "Find cars in {location}",
    "perDay": "per day",
    "bookOn": "Book on {provider}",
    "cheapest": "Cheapest option",
    "loading": "Loading cars from {provider}…",
    "fetchingPrices": "Fetching up-to-date prices…",
    "pricesAsOf": "Prices as of {time}"
  },
  "affiliate": {
    "title": "Find cars in {location}",
    "subtitle": "We search directly on the biggest car rental platforms so you always get the real price.",
    "note": "Opens on the partner site with your search pre-filled · Free to use"
  },
  "footer": { "tagline": "Digging deep. Building solutions." }
}
```

**`src/messages/th.json`**
```json
{
  "nav": { "home": "RentACarMole" },
  "hero": { "title": "เปรียบเทียบราคารถเช่า ไม่มีค่าธรรมเนียมซ่อน", "subtitle": "ค้นหาจาก Booking.com, Rentalcars, Kayak และ Expedia" },
  "search": {
    "pickup": "สถานที่รับรถ",
    "dropoff": "สถานที่คืนรถ",
    "pickupDate": "วันรับรถ",
    "dropoffDate": "วันคืนรถ",
    "driverAge": "อายุผู้ขับ",
    "search": "ค้นหารถเช่า",
    "sameLocation": "คืนที่เดิม"
  },
  "results": {
    "found": "พบรถ {count} คัน",
    "noneFound": "ไม่พบรถเช่า",
    "compareOn": "เปรียบเทียบบนเว็บชั้นนำ",
    "findCars": "ค้นหารถเช่าใน {location}",
    "perDay": "ต่อวัน",
    "bookOn": "จองที่ {provider}",
    "cheapest": "ราคาถูกที่สุด",
    "loading": "กำลังโหลดรถเช่าจาก {provider}…",
    "fetchingPrices": "กำลังอัปเดตราคา…",
    "pricesAsOf": "ราคา ณ เวลา {time}"
  },
  "affiliate": {
    "title": "ค้นหารถเช่าใน {location}",
    "subtitle": "เราค้นหาตรงจากแพลตฟอร์มเช่ารถรายใหญ่เพื่อให้คุณได้ราคาจริงเสมอ",
    "note": "เปิดหน้าเว็บพาร์ทเนอร์พร้อมกรอกข้อมูลให้อัตโนมัติ · ฟรี"
  },
  "footer": { "tagline": "ค้นหาลึก สร้างสรรค์โซลูชัน" }
}
```

### 3. Popular Thai pickup locations
Add to the `POPULAR_LOCATIONS` list in `src/lib/search.ts`:
```ts
{ name: "Bangkok (Suvarnabhumi), Thailand", code: "BKK" },
{ name: "Bangkok (Don Mueang), Thailand", code: "DMK" },
{ name: "Phuket, Thailand", code: "HKT" },
{ name: "Chiang Mai, Thailand", code: "CNX" },
{ name: "Koh Samui, Thailand", code: "USM" },
```

### 4. Language selector
`src/components/LanguageSelector.tsx` — 🇬🇧 EN / 🇹🇭 TH, sets cookie + `router.refresh()`.

### 5. Replace hardcoded strings
Priority: `layout.tsx`, `SearchForm.tsx`, `ResultsClient.tsx`, `CarResultCard.tsx`, `AffiliateCarSearch.tsx`, `CarLoadingOverlay.tsx`.

### 6. Thai font
```tsx
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"] });
```
