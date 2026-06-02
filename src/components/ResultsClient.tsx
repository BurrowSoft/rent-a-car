"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { RentalCar } from "@burrowsoft/shared";
import { CarLoadingOverlay, type ProviderStatus } from "./CarLoadingOverlay";
import { CarResultCard } from "./CarResultCard";
import { AffiliateCarSearch } from "./AffiliateCarSearch";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const SETTLED_DISMISS_MS = 1500; // delay before overlay fades after providers settle

interface SearchParams {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  driverAge: string;
}

interface ApiResult {
  cars: RentalCar[];
  providers: string[];
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDateRange(pickupDate: string, dropoffDate: string) {
  const fmt = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  return `${fmt(pickupDate)} – ${fmt(dropoffDate)}`;
}

function buildApiUrl(params: SearchParams): string {
  const sp = new URLSearchParams({
    pickupLocation: params.pickupLocation,
    dropoffLocation: params.dropoffLocation || params.pickupLocation,
    pickupDate: params.pickupDate,
    pickupTime: params.pickupTime,
    dropoffDate: params.dropoffDate,
    dropoffTime: params.dropoffTime,
    driverAge: params.driverAge,
  });
  return `/api/cars?${sp.toString()}`;
}

export function ResultsClient({ params }: { params: SearchParams }) {
  const [cars, setCars] = useState<RentalCar[]>([]);
  const [overlayProviders, setOverlayProviders] = useState<ProviderStatus[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayMessage, setOverlayMessage] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  };

  const fetchCars = useCallback(
    async (isRefresh = false) => {
      setOverlayProviders([]);
      setOverlayVisible(true);
      setOverlayMessage(isRefresh ? "Fetching up-to-date prices…" : undefined);

      try {
        const res = await fetch(buildApiUrl(params));
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data: ApiResult = await res.json();

        // Map response providers to done status
        const settled: ProviderStatus[] = data.providers.map((name) => ({
          name,
          status: "done",
          count: data.cars.filter((c) => c.provider === name).length,
        }));
        setOverlayProviders(settled);
        setCars(data.cars);
        setLastUpdated(new Date());

        // Dismiss overlay after short delay
        setTimeout(() => setOverlayVisible(false), SETTLED_DISMISS_MS);

        // Schedule next auto-refresh
        clearRefreshTimer();
        refreshTimer.current = setTimeout(() => fetchCars(true), REFRESH_INTERVAL_MS);
      } catch {
        if (isRefresh) {
          setToast(
            `Prices could not be refreshed — last updated at ${lastUpdated ? fmtTime(lastUpdated) : "—"}`
          );
          setTimeout(() => setToast(null), 5000);
          setOverlayVisible(false);
        } else {
          setOverlayProviders([{ name: "Car search", status: "unavailable" }]);
          setTimeout(() => setOverlayVisible(false), 2000);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.pickupLocation, params.dropoffLocation, params.pickupDate, params.pickupTime, params.dropoffDate, params.dropoffTime, params.driverAge]
  );

  useEffect(() => {
    fetchCars(false);
    return () => clearRefreshTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cheapestPrice = cars.reduce<number | null>((min, c) => {
    if (c.pricePerDay.amount === 0) return min;
    return min === null ? c.pricePerDay.amount : Math.min(min, c.pricePerDay.amount);
  }, null);

  return (
    <>
      <CarLoadingOverlay
        isVisible={overlayVisible}
        providers={overlayProviders}
        message={overlayMessage}
      />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              href="/"
              className="mb-1 inline-flex items-center gap-1 text-sm text-rose-500 hover:underline"
            >
              ← New search
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Cars in {params.pickupLocation}
            </h1>
            <p className="text-sm text-slate-500">
              {fmtDateRange(params.pickupDate, params.dropoffDate)}
              {params.dropoffLocation && params.dropoffLocation !== params.pickupLocation && (
                <> · Drop-off: {params.dropoffLocation}</>
              )}
              {" "}· Driver age {params.driverAge}
            </p>
          </div>

          {lastUpdated && (
            <p className="text-xs text-slate-400">Prices as of {fmtTime(lastUpdated)}</p>
          )}
        </div>

        {/* Results */}
        {!overlayVisible && cars.length === 0 && (
          <AffiliateCarSearch params={params} variant="empty" />
        )}

        {cars.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {cars.length} result{cars.length !== 1 ? "s" : ""} found
            </p>
            <ul className="space-y-4">
              {cars.map((car) => (
                <li key={car.id}>
                  <CarResultCard
                    car={car}
                    isCheapest={
                      cheapestPrice !== null && car.pricePerDay.amount === cheapestPrice
                    }
                  />
                </li>
              ))}
            </ul>
            <AffiliateCarSearch params={params} variant="below" />
          </>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-800 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
