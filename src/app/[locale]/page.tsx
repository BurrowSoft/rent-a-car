import { getTranslations, setRequestLocale } from "next-intl/server";
import { CarRentalWidget } from "@/components/CarRentalWidget";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

// Locales that use non-Localrent widgets (show hero branding above the widget)
const NON_LOCALRENT = new Set(["es", "ru", "pt-BR", "fr", "ja"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNoAds = await getTranslations("noAds");
  return {
    title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
    description: `${tNoAds("tagline")} — ${SITE_DESCRIPTION}`,
    alternates: { canonical: SITE_URL },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isLocalrent = !NON_LOCALRENT.has(locale);
  const t = await getTranslations("hero");
  const tNoAds = await getTranslations("noAds");

  return (
    <>
      {/* Tagline — always visible above the fold for Localrent locales */}
      {isLocalrent && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 text-center">
          <p className="text-base font-semibold tracking-wide text-amber-600">
            {tNoAds("tagline")}
          </p>
        </div>
      )}

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
            <p className="mt-2 text-base font-semibold tracking-wide text-amber-300">
              {tNoAds("tagline")}
            </p>
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

      <div className={isLocalrent ? "w-full" : "mx-auto max-w-5xl px-4 py-8"}>
        <CarRentalWidget />
      </div>
    </>
  );
}
