import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
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
import { headers } from "next/headers";
import { detectCountry, getCountryName, AppHeader, AppFooter } from "@burrowsoft/shared";
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
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const countryName = getCountryName(country);
  const desc = `Looking for car rental in ${countryName}? RentACarMole compares top providers. Free cancellation. No credit card required to search. Best deals guaranteed.`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Car Rental in ${countryName} — RentACarMole`,
      template: `%s | RentACarMole`,
    },
    description: desc,
    keywords: ["car rental", "rent a car", "cheap car hire", "rental cars", "car hire deals"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    alternates: {
      canonical: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, l === "en" ? `${BASE}/` : `${BASE}/${l}/`]),
        ["x-default", `${BASE}/`],
      ]),
    },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      siteName: SITE_NAME,
      title: `Car Rental in ${countryName} — RentACarMole`,
      description: desc,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Car Rental in ${countryName} — RentACarMole`,
      description: desc,
      images: ["/og-image.png"],
    },
    other: { "google-adsense-account": "ca-pub-1009857008755875" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
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
          <AppHeader
            logo={
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/mascot.png" alt={SITE_NAME} width={40} height={40} className="shrink-0" priority />
                <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
              </Link>
            }
            right={
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">{tn("tagline")}</span>
                <LocaleSelector />
              </div>
            }
          />

          <main>{children}</main>

          <AppFooter
            supportEmail="support@rentacarmole.com"
            accentHoverClass="hover:text-rose-500"
            currentSite="RentACarMole"
          >
            <div className="pb-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Help</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><span className="text-slate-400">Travel insurance</span></li>
                <li><span className="text-slate-400">Free cancellation</span></li>
              </ul>
            </div>
          </AppFooter>

          {/* <RegionalFloatingAd /> */}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
