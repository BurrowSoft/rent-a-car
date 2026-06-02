"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function SearchForm() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [sameDropoff, setSameDropoff] = useState(true);
  const [pickupDate, setPickupDate] = useState(inDays(7));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState(inDays(10));
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [driverAge, setDriverAge] = useState("30");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams({
      pickupLocation,
      dropoffLocation: sameDropoff ? pickupLocation : dropoffLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      driverAge,
    });
    router.push(`/results?${sp.toString()}`);
  }

  const times = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
    >
      {/* Pickup location */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pick-up location
        </label>
        <input
          required
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="City, airport or address"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {/* Same drop-off toggle */}
      <div className="mb-4 flex items-center gap-2">
        <input
          id="same-dropoff"
          type="checkbox"
          checked={sameDropoff}
          onChange={(e) => setSameDropoff(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 accent-rose-500"
        />
        <label htmlFor="same-dropoff" className="text-sm text-slate-600">
          Return to same location
        </label>
      </div>

      {/* Dropoff location */}
      {!sameDropoff && (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Drop-off location
          </label>
          <input
            required
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            placeholder="City, airport or address"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
      )}

      {/* Dates & times */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pick-up date
          </label>
          <input
            required
            type="date"
            value={pickupDate}
            min={today()}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pick-up time
          </label>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          >
            {times.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Drop-off date
          </label>
          <input
            required
            type="date"
            value={dropoffDate}
            min={pickupDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Drop-off time
          </label>
          <select
            value={dropoffTime}
            onChange={(e) => setDropoffTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          >
            {times.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Driver age */}
      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Driver age
        </label>
        <select
          value={driverAge}
          onChange={(e) => setDriverAge(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
        >
          {Array.from({ length: 51 }, (_, i) => i + 18).map((age) => (
            <option key={age} value={String(age)}>{age} years old</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-rose-500 px-6 py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-rose-600 active:bg-rose-700"
      >
        Search rental cars →
      </button>
    </form>
  );
}
