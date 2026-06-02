# RentACarMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `RAPIDAPI_KEY` — booking-com15 (cars endpoint, known reliability issues)
- `OPENAI_API_KEY` — AI summaries

## Architecture: Client-Driven Fetching
All search calls must go through a Next.js API route (`/api/cars`) rather than directly in server components. This enables the client to drive the loading overlay.

Pattern:
1. User submits search → client calls `/api/cars?...`
2. API route fans out to all providers concurrently via `ProviderRouter`
3. Client shows the loading overlay per provider
4. Results return as JSON; client renders them

Wrap every provider call with `unstable_cache` from `next/cache` (TTL: 10 min / `revalidate: 600`). Cache key = all search params stringified.

## ⚠️ Known Issue
The booking-com15 cars backend has reliability issues. The current app falls back to an affiliate redirect. The goal of this TODO is to get real car data displaying, with the affiliate redirect as the actual booking CTA.

## ⚠️ Vercel Env Var Discrepancy
Vercel has both `RAPIDAPI_KEY` (Production only) and `RAPID_API_KEY` (Production + Preview). The codebase uses `RAPIDAPI_KEY`. Confirm which is correct and remove the duplicate from Vercel.

## Tasks

### 1. Investigate Booking.com cars endpoint reliability
RapidAPI host: `booking-com15.p.rapidapi.com`
Endpoint: `GET /api/v1/cars/searchCarRentals`
- Make a test call and log the full response
- If the endpoint consistently returns data, wire it up properly
- If it's still broken, move to task 2

### 2. Find and add a working car rental RapidAPI provider
Search RapidAPI for car rental APIs with good uptime (e.g. "rentalcars", "kayak cars", "priceline cars").
- Implement the best candidate as a new provider in `packages/shared/src/providers/cars/`
- Requires a new env var — add to Vercel and `.env.example`
- Normalize results to the `RentalCar` DTO from `@burrowsoft/shared`

### 3. Real car data: photos, specs, pricing
Once a working API is found:
- Display car category photo (economy, SUV, van, etc.) — most providers return image URLs
- Show specs: seats, doors, transmission (auto/manual), AC, luggage
- Show price per day clearly
- Show pickup/dropoff location name

### 4. Booking CTA
- "Book" button should link to the Booking.com affiliate redirect with pre-filled search params (location, dates)
- Use the existing affiliate URL builder in `src/lib/`

### 5. Price comparison
If two car rental providers are wired:
- Show both prices side by side on the results card
- "Cheapest option" badge on the lowest price

### 6. Loading overlay — show while APIs are fetching
The search results page must show a loading overlay while provider calls are in flight. Requirements:
- Each active provider fetches concurrently; the overlay displays one animated line per provider, e.g. "Loading cars from Booking.com…" / "Loading cars from RentalCars…"
- As each provider resolves, its line gets a checkmark and results stream in below
- If a provider fails, its line shows "[Provider] unavailable" in muted text — no hard error
- Implement as a client component (`<CarLoadingOverlay providers={string[]} />`)
- Overlay fades out once all providers have settled

### 7. Provider redirect buttons
Every car result card must have a labelled booking button per provider. Requirements:
- Button label: "Book on [Provider]" (e.g. "Book on Booking.com", "Book on RentalCars")
- Each provider class must expose a `bookingUrl(car: RentalCar, pickUp: string, dropOff: string, dates: { from: string; to: string }): string` method returning a deep-link with location and dates pre-filled
- Show all available provider buttons per result; highlight the cheapest
- Buttons open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Append affiliate label where applicable

### 8. Price staleness — auto-refresh after 5 minutes
Car rental prices and availability change. Requirements:
- Client tracks the timestamp when results were last loaded
- After 5 minutes on the results page, silently re-call `/api/cars` with the same params
- While refreshing, show the loading overlay with "Fetching up-to-date prices…" (same overlay component, reused)
- When fresh results arrive, update the list in place — no hard refresh, no scroll reset
- If the refresh fails, show a small toast: "Prices could not be refreshed — last updated at HH:MM"
- Always show a "Prices as of HH:MM" timestamp below the results header

### 9. Themed mascot — RentACarMole
Create `public/mascot.svg` — the base BurrowSoft Mole peeking over a ledge, with a small cartoon car visible beneath the ledge (as if the mole is peeking out from behind a car roof). Same black line-art stroke style. SVG groups: `<g id="mole-base">` and `<g id="prop">`. ViewBox: `0 0 200 200`.

### 10. App thumbnail / OG image
- `public/og-image.png` — 1200×630px, RentACarMole mascot centred on brand background, "RentACarMole" wordmark below
- `public/favicon.ico` — mole head only, 32×32 and 16×16
- `public/apple-touch-icon.png` — 180×180px
- Wire all into `src/app/layout.tsx` metadata

### 11. Footer — BurrowSoft branding
Add to the existing footer:
- Small BurrowSoft logo (mole + wordmark) linking to burrowsoft.com
- Links to sibling products: FlyMole, BookingMole, InsightMole, GamesMole, ShoppingMole
- Copyright: "© 2025 BurrowSoft. All rights reserved."
Logo assets: copy `burrowsoft-logo.svg` from the main-website repo into `public/`.

### 12. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, hotel-booking, news-feed, main-website, games, shopping.
