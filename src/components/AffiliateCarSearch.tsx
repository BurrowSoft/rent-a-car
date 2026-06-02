"use client";

import {
  buildBookingCarsUrl,
  buildRentalcarsUrl,
  buildKayakCarsUrl,
  buildExpediaCarsUrl,
  type CarSearchParams,
} from "@/lib/search";

interface Provider {
  name: string;
  emoji: string;
  description: string;
  color: string;
  buildUrl: (p: CarSearchParams) => string;
}

const PROVIDERS: Provider[] = [
  {
    name: "Booking.com",
    emoji: "🔵",
    description: "500+ rental companies worldwide",
    color: "bg-blue-600 hover:bg-blue-700",
    buildUrl: buildBookingCarsUrl,
  },
  {
    name: "Rentalcars.com",
    emoji: "🟠",
    description: "Best price guarantee, free cancellation",
    color: "bg-orange-500 hover:bg-orange-600",
    buildUrl: buildRentalcarsUrl,
  },
  {
    name: "Kayak",
    emoji: "🔴",
    description: "Compare hundreds of car rental sites",
    color: "bg-rose-500 hover:bg-rose-600",
    buildUrl: buildKayakCarsUrl,
  },
  {
    name: "Expedia",
    emoji: "🟡",
    description: "Bundle with hotel for extra savings",
    color: "bg-yellow-500 hover:bg-yellow-600",
    buildUrl: buildExpediaCarsUrl,
  },
];

interface Props {
  params: CarSearchParams;
  variant?: "empty" | "below";
}

export function AffiliateCarSearch({ params, variant = "empty" }: Props) {
  return (
    <div
      className={
        variant === "empty"
          ? "rounded-2xl border border-slate-200 bg-white p-6"
          : "mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6"
      }
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-500">
        {variant === "empty" ? "Compare on top sites" : "Also compare on"}
      </p>
      <h2 className="mb-1 text-lg font-extrabold text-slate-900">
        {variant === "empty"
          ? `Find cars in ${params.pickupLocation}`
          : "Looking for more options?"}
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        {variant === "empty"
          ? "We search directly on the biggest car rental platforms so you always get the real price."
          : "Compare prices across more car rental platforms to find the best deal."}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROVIDERS.map((provider) => (
          <a
            key={provider.name}
            href={provider.buildUrl(params)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${provider.color}`}
          >
            <span className="text-2xl" aria-hidden>
              🚗
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{provider.name}</p>
              <p className="text-xs opacity-80 leading-tight">{provider.description}</p>
            </div>
            <span className="text-xs opacity-70 shrink-0">↗</span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center">
        Opens on the partner site with your search pre-filled · Free to use
      </p>
    </div>
  );
}
