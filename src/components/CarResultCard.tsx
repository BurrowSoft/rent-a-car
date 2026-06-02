import type { RentalCar } from "@burrowsoft/shared";

interface Props {
  car: RentalCar;
  isCheapest?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Economy": "🚗",
  "Compact": "🚙",
  "SUV": "🚐",
  "Van": "🚌",
  "Luxury": "🏎️",
  "Convertible": "🚘",
  "All Categories": "🚗",
};

function categoryIcon(category: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "🚗";
}

export function CarResultCard({ car, isCheapest }: Props) {
  const hasPrice = car.pricePerDay.amount > 0;

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      {isCheapest && (
        <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          Cheapest option
        </span>
      )}

      {/* Image / icon */}
      <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl bg-rose-50 text-5xl sm:h-28 sm:w-36">
        {car.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.imageUrl}
            alt={car.model}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span aria-hidden>{categoryIcon(car.category)}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-rose-500">
                {car.category}
              </p>
              <h3 className="text-base font-bold text-slate-900">{car.model}</h3>
              <p className="text-sm text-slate-500">{car.supplier}</p>
            </div>
            <div className="text-right">
              {hasPrice ? (
                <>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {car.pricePerDay.formatted}
                  </p>
                  <p className="text-xs text-slate-400">per day</p>
                  {car.totalPrice.amount > 0 && (
                    <p className="text-xs text-slate-500">
                      Total: {car.totalPrice.formatted}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-500">Compare prices →</p>
              )}
            </div>
          </div>

          {/* Specs */}
          {(car.seats > 0 || car.doors != null || car.transmission || car.ac != null || car.largeLuggage != null) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              {car.seats > 0 && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>👤</span> {car.seats} seats
                </span>
              )}
              {car.doors != null && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>🚪</span> {car.doors} doors
                </span>
              )}
              {car.transmission && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>⚙️</span>{" "}
                  {car.transmission === "automatic" ? "Auto" : "Manual"}
                </span>
              )}
              {car.ac === true && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>❄️</span> A/C
                </span>
              )}
              {(car.largeLuggage != null || car.smallLuggage != null) && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>🧳</span>{" "}
                  {car.largeLuggage ?? 0}L / {car.smallLuggage ?? 0}S bags
                </span>
              )}
            </div>
          )}

          {/* Features */}
          {car.features.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {car.features.slice(0, 4).map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-2">
          <a
            href={car.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${
              isCheapest
                ? "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
                : "bg-rose-500 hover:bg-rose-600 active:bg-rose-700"
            }`}
          >
            Book on {car.provider}
            <span aria-hidden className="text-xs opacity-75">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
