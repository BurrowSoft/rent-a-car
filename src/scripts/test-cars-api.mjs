/**
 * Test script for booking-com15 cars endpoint.
 *
 * Usage:
 *   RAPIDAPI_KEY=<your_key> node src/scripts/test-cars-api.mjs
 *
 * Or on Windows PowerShell:
 *   $env:RAPIDAPI_KEY = "<your_key>"; node src/scripts/test-cars-api.mjs
 *
 * Optional env vars:
 *   LOCATION    (default: "JFK Airport, New York")
 *   PICKUP_DATE (default: 7 days from today, YYYY-MM-DD)
 *   DROPOFF_DATE (default: 10 days from today, YYYY-MM-DD)
 */

const KEY = process.env.RAPIDAPI_KEY;
if (!KEY) {
  console.error("ERROR: RAPIDAPI_KEY env var is required");
  process.exit(1);
}

const HOST = "booking-com15.p.rapidapi.com";
const headers = {
  "X-RapidAPI-Key": KEY,
  "X-RapidAPI-Host": HOST,
};

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const LOCATION = process.env.LOCATION ?? "JFK Airport, New York";
const PICKUP_DATE = process.env.PICKUP_DATE ?? daysFromNow(7);
const DROPOFF_DATE = process.env.DROPOFF_DATE ?? daysFromNow(10);
const PICKUP_TIME = "10:00";
const DROPOFF_TIME = "10:00";
const DRIVER_AGE = "30";
const CURRENCY = "USD";

console.log("=".repeat(60));
console.log("STEP 1: Geocode location");
console.log("  Location:", LOCATION);
console.log("=".repeat(60));

const destUrl = `https://${HOST}/api/v1/cars/searchDestination?query=${encodeURIComponent(LOCATION)}`;
let destRes;
try {
  destRes = await fetch(destUrl, { headers });
} catch (e) {
  console.error("NETWORK ERROR (geocode):", e.message);
  process.exit(1);
}

console.log("  HTTP status:", destRes.status);
const destJson = await destRes.json();
console.log("  Full response:\n", JSON.stringify(destJson, null, 2).slice(0, 2000));

const data = destJson?.data;
const first = Array.isArray(data) ? data[0] : undefined;
if (!first) {
  console.error("\nGeocode returned no results. Endpoint may be unreliable or location format is wrong.");
  console.log("Try a different LOCATION value, e.g.: LOCATION='Los Angeles' node src/scripts/test-cars-api.mjs");
  process.exit(1);
}

const lat = first?.coordinates?.latitude ?? first?.latitude;
const lng = first?.coordinates?.longitude ?? first?.longitude;
console.log(`\n  Picked: "${first?.name ?? "?"}" lat=${lat} lng=${lng}`);

if (!lat || !lng) {
  console.error("Could not extract lat/lng from geocode response. Check the response shape above.");
  process.exit(1);
}

console.log("\n" + "=".repeat(60));
console.log("STEP 2: Search cars");
console.log(`  ${PICKUP_DATE} ${PICKUP_TIME} → ${DROPOFF_DATE} ${DROPOFF_TIME}`);
console.log("=".repeat(60));

const sp = new URLSearchParams({
  pick_up_latitude: String(lat),
  pick_up_longitude: String(lng),
  drop_off_latitude: String(lat),
  drop_off_longitude: String(lng),
  pick_up_date: PICKUP_DATE,
  pick_up_time: PICKUP_TIME,
  drop_off_date: DROPOFF_DATE,
  drop_off_time: DROPOFF_TIME,
  driver_age: DRIVER_AGE,
  currency_code: CURRENCY,
  units: "imperial",
});

const carsUrl = `https://${HOST}/api/v1/cars/searchCarRentals?${sp}`;
let carsRes;
try {
  carsRes = await fetch(carsUrl, { headers });
} catch (e) {
  console.error("NETWORK ERROR (searchCarRentals):", e.message);
  process.exit(1);
}

console.log("  HTTP status:", carsRes.status);
const carsJson = await carsRes.json();

// Show summary
const results = carsJson?.data?.search_results;
if (!Array.isArray(results)) {
  console.log("\n  RESULT: No search_results array in response. Full response:");
  console.log(JSON.stringify(carsJson, null, 2).slice(0, 3000));
  process.exit(0);
}

console.log(`\n  RESULT: ${results.length} car(s) returned`);
if (results.length > 0) {
  console.log("\n  First result top-level keys:", Object.keys(results[0]));
  console.log("\n  First result (full):\n", JSON.stringify(results[0], null, 2).slice(0, 3000));
}
console.log("\n  VERDICT:", results.length > 0
  ? "✅ Endpoint is WORKING — real car data available!"
  : "❌ Endpoint returned 0 results — may be unreliable or query needs adjustment");
