import { SearchForm } from "@/components/SearchForm";
import { POPULAR_LOCATIONS } from "@/lib/search";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

const FEATURES = [
  { icon: "🏆", title: "Top suppliers", body: "Hertz, Avis, Budget, Enterprise, Sixt and more — all in one search." },
  { icon: "💰", title: "Best price", body: "We compare rates across suppliers so you always get the lowest fare." },
  { icon: "🚫", title: "No hidden fees", body: "The price you see includes taxes and standard coverage. No surprises." },
  { icon: "🔄", title: "Free cancellation", body: "Most bookings can be cancelled free of charge up to 48 hours before pickup." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                Compare 500+ car rental suppliers
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Find your perfect<br />rental car.
              </h1>
              <p className="mt-4 text-lg text-rose-100 leading-relaxed">
                {SITE_DESCRIPTION}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-rose-100">
                <span>✓ Free cancellation</span>
                <span>✓ No credit card fees</span>
                <span>✓ 24/7 support</span>
              </div>
            </div>
            <div>
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular locations */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">Popular destinations</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {POPULAR_LOCATIONS.map((loc) => (
              <div
                key={loc.code}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-sm font-bold text-rose-500">
                  {loc.code}
                </span>
                <span className="text-sm font-medium text-slate-700">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
