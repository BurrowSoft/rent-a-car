import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Sarabun,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Sans_KR,
  Noto_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { RegionalFloatingAd } from "@burrowsoft/shared";
import { Link } from "@/i18n/navigation";
import { LocaleSelector } from "@/components/LocaleSelector";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "../globals.css";

const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], display: "swap" });
const notoJP  = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoSC  = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoTC  = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoKR  = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoAR  = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "700"], display: "swap" });

const LOCALE_FONT: Record<string, { className: string }> = {
  th: sarabun, ja: notoJP, zh: notoSC, "zh-TW": notoTC, ko: notoKR, ar: notoAR,
};

const BASE = "https://www.rentacarmole.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: ["car rental", "rent a car", "cheap car hire", "rental cars", "car hire deals"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    alternates: {
      canonical: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [
          l,
          l === "en" ? `${BASE}/` : `${BASE}/${l}/`,
        ]),
        ["x-default", `${BASE}/`],
      ]),
    },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
      description: SITE_DESCRIPTION,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
      description: SITE_DESCRIPTION,
      images: ["/og-image.png"],
    },
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
    other: { "google-adsense-account": "ca-pub-1009857008755875" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "footer" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const fontClass = LOCALE_FONT[locale]?.className ?? "";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={fontClass}>
      <head>
        {/* Travelpayouts affiliate tracking */}
        <script async src="https://tp-em.com/NTM1Njgy.js?t=535682" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <meta name="fo-verify" content="bbc63628-c7bf-452c-aa36-d70a12ac92ba" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "RentACarMole",
            "url": BASE,
            "description": "Compare car rental deals from top suppliers worldwide. No hidden fees, free cancellation.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": `${BASE}/?q={pickup_location}` },
              "query-input": "required name=pickup_location",
            },
          }) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Main navigation">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-rose-500">
                <span aria-hidden>🚗</span>
                {tn("home")}
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">{tn("tagline")}</span>
                <LocaleSelector />
              </div>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8">
              <div className="flex flex-wrap gap-6">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("help")}</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><span className="text-slate-400">{t("insurance")}</span></li>
                    <li><span className="text-slate-400">{t("cancellation")}</span></li>
                    <li>
                      <a href="mailto:support@rentacarmole.com" className="hover:text-rose-500 transition-colors">
                        support@rentacarmole.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <a href="https://burrowsoft.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors" aria-label="BurrowSoft">
                    <svg width="22" height="22" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="100" cy="100" r="96" fill="#f43f5e"/>
                      <circle cx="100" cy="90" r="50" fill="white" stroke="#1e2d3d" strokeWidth="6"/>
                      <circle cx="82" cy="86" r="15" fill="white" stroke="#1e2d3d" strokeWidth="4"/>
                      <circle cx="118" cy="86" r="15" fill="white" stroke="#1e2d3d" strokeWidth="4"/>
                      <circle cx="82" cy="86" r="7" fill="#1e2d3d"/>
                      <circle cx="84" cy="84" r="3" fill="white"/>
                      <circle cx="118" cy="86" r="7" fill="#1e2d3d"/>
                      <circle cx="120" cy="84" r="3" fill="white"/>
                      <ellipse cx="100" cy="108" rx="6" ry="4.5" fill="#1e2d3d"/>
                      <rect x="10" y="134" width="180" height="14" rx="5" fill="#1e2d3d"/>
                    </svg>
                    <span className="text-sm font-semibold">BurrowSoft</span>
                  </a>
                  <nav aria-label="BurrowSoft products">
                    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      {[
                        { label: "FlyMole", href: "https://flymole.com" },
                        { label: "BookingMole", href: "https://bookingmole.com" },
                        { label: "InsightMole", href: "https://insightmole.com" },
                        { label: "GamesMole", href: "https://gamesmole.com" },
                        { label: "ShoppingMole", href: "https://shoppingmole.com" },
                      ].map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            className="hover:text-slate-600 transition-colors">
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <p className="text-xs text-slate-400">{t("copyright")}</p>
                </div>
              </div>
            </div>
          </footer>

          {/* <RegionalFloatingAd /> */}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
