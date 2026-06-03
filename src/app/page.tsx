import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { detectCountry } from "@burrowsoft/shared";
import { CarRentalWidget } from "@/components/CarRentalWidget";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

function getProvider(country: string) {
  if (["ES", "RU", "BR", "FR"].includes(country)) return "economybookings";
  if (["JP", "MX"].includes(country)) return "qeeq";
  if (["FI", "PL", "GB", "US"].includes(country)) return "autoeurope";
  return "localrent";
}

export default async function HomePage() {
  const country = detectCountry(await headers() as unknown as Headers);
  const isLocalrent = getProvider(country) === "localrent";
  const t = await getTranslations("hero");

  return (
    <>
      {/* Branded hero — only for non-Localrent providers */}
      {!isLocalrent && (
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-700 py-14 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
              {t("badge")}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-lg text-rose-100 leading-relaxed max-w-xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-rose-100">
              <span>{t("trust1")}</span>
              <span>{t("trust2")}</span>
              <span>{t("trust3")}</span>
            </div>
          </div>
        </section>
      )}

      {/* Widget — clear sticky header with mt-16 */}
      <div className={isLocalrent ? "w-full mt-16" : "mx-auto max-w-5xl px-4 py-8 mt-16"}>
        <CarRentalWidget country={country} />
      </div>
    </>
  );
}
