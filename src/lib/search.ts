export interface CarSearchParams {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  driverAge: string;
}

export function buildBookingCarsUrl(params: CarSearchParams): string {
  const base = "https://cars.booking.com/index.html";
  const query = new URLSearchParams({
    label: "rentacarmole-affiliate",
    lang: "en-us",
    pickup_location: params.pickupLocation,
    dropoff_location: params.dropoffLocation || params.pickupLocation,
    pickup_date: params.pickupDate,
    pickup_time: params.pickupTime,
    dropoff_date: params.dropoffDate,
    dropoff_time: params.dropoffTime,
    driver_age: params.driverAge,
  });
  return `${base}?${query.toString()}`;
}

export function buildRentalcarsUrl(params: CarSearchParams): string {
  const base = "https://www.rentalcars.com/SearchResults.do";
  const query = new URLSearchParams({
    pickUpName: params.pickupLocation,
    dropOffName: params.dropoffLocation || params.pickupLocation,
    pickUpDate: params.pickupDate,
    pickUpTime: params.pickupTime,
    dropOffDate: params.dropoffDate,
    dropOffTime: params.dropoffTime,
    driverAge: params.driverAge,
  });
  const affiliateCode = process.env.NEXT_PUBLIC_RENTALCARS_AFFILIATE;
  if (affiliateCode) query.set("affiliateCode", affiliateCode);
  return `${base}?${query.toString()}`;
}

export function buildKayakCarsUrl(params: CarSearchParams): string {
  // Kayak format: /cars/Location/YYYY-MM-DD-HHhMM/YYYY-MM-DD-HHhMM
  const toKayakTime = (date: string, time: string) =>
    `${date}-${time.replace(":", "h")}`;
  const location = encodeURIComponent(params.pickupLocation.replace(/,/g, ""));
  const pickup = toKayakTime(params.pickupDate, params.pickupTime);
  const dropoff = toKayakTime(params.dropoffDate, params.dropoffTime);
  return `https://www.kayak.com/cars/${location}/${pickup}/${dropoff}`;
}

export function buildExpediaCarsUrl(params: CarSearchParams): string {
  const base = "https://www.expedia.com/Cars/search";
  const query = new URLSearchParams({
    locn: params.pickupLocation,
    d1: params.pickupDate,
    t1: params.pickupTime,
    d2: params.dropoffDate,
    t2: params.dropoffTime,
    driverAge: params.driverAge,
  });
  return `${base}?${query.toString()}`;
}

export const POPULAR_LOCATIONS = [
  { name: "New York, USA", code: "JFK" },
  { name: "Los Angeles, USA", code: "LAX" },
  { name: "Miami, USA", code: "MIA" },
  { name: "London, UK", code: "LHR" },
  { name: "Paris, France", code: "CDG" },
  { name: "Barcelona, Spain", code: "BCN" },
  { name: "Rome, Italy", code: "FCO" },
  { name: "Dubai, UAE", code: "DXB" },
  { name: "Bangkok, Thailand", code: "BKK" },
  { name: "Tokyo, Japan", code: "NRT" },
  { name: "Sydney, Australia", code: "SYD" },
  { name: "Cancun, Mexico", code: "CUN" },
];
