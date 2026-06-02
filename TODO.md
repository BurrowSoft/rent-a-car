# RentACarMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `RAPIDAPI_KEY` — booking-com15 (cars endpoint, known reliability issues)
- `OPENAI_API_KEY` — AI summaries

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

### 6. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, hotel-booking, news-feed, main-website, games, shopping.
