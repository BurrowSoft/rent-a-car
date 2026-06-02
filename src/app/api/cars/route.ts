import { type NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { createCarRouter, detectCountry, getCurrencyForCountry } from "@burrowsoft/shared";
import type { CarSearchParams, RentalCar } from "@burrowsoft/shared";

const cachedCarSearch = unstable_cache(
  async (params: CarSearchParams, country: string): Promise<{ cars: RentalCar[]; providers: string[] }> => {
    const router = createCarRouter();
    const cars = await router.search(params, country);
    const providers = [...new Set(cars.map((c) => c.provider))];
    return { cars, providers };
  },
  ["car-search"],
  { revalidate: 600 }
);

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  const pickupLocation = sp.get("pickupLocation") ?? "";
  const dropoffLocation = sp.get("dropoffLocation") ?? "";
  const pickupDate = sp.get("pickupDate") ?? "";
  const pickupTime = sp.get("pickupTime") ?? "10:00";
  const dropoffDate = sp.get("dropoffDate") ?? "";
  const dropoffTime = sp.get("dropoffTime") ?? "10:00";
  const driverAge = parseInt(sp.get("driverAge") ?? "30", 10);

  if (!pickupLocation || !pickupDate || !dropoffDate) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const hdrs = await headers();
  const country = detectCountry(hdrs as unknown as Headers);
  const currency = getCurrencyForCountry(country);

  const params: CarSearchParams = {
    pickupLocation,
    dropoffLocation: dropoffLocation || pickupLocation,
    pickupDatetime: `${pickupDate}T${pickupTime}:00`,
    dropoffDatetime: `${dropoffDate}T${dropoffTime}:00`,
    driverAge: isNaN(driverAge) ? 30 : driverAge,
    currency,
    country,
  };

  try {
    const result = await cachedCarSearch(params, country);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Car search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
