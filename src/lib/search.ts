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
