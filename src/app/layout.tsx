import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
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
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { LanguageSelector, RegionalFloatingAd } from "@burrowsoft/shared";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sarabun  = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], display: "swap" });
const notoJP   = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoSC   = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoTC   = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoKR   = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const notoAR   = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "700"], display: "swap" });

const LOCALE_FONT: Record<string, { className: string }> = {
  th: sarabun,
  ja: notoJP,
  zh: notoSC,
  "zh-TW": notoTC,
  ko: notoKR,
  ar: notoAR,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["car rental", "rent a car", "cheap car hire", "rental cars", "car hire deals"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: { "google-adsense-account": "ca-pub-1009857008755875" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f43f5e",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "footer" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const fontClass = LOCALE_FONT[locale]?.className ?? "";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={fontClass}
    >
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="border-b border-slate-200 bg-white">
            <nav
              className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
              aria-label="Main navigation"
            >
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-rose-500">
                <span aria-hidden>🚗</span>
                {tn("home")}
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-slate-400">
                  {tn("tagline")}
                </span>
                <LanguageSelector locales={["en","th","es","ru","pt-BR","fr","ja","zh","zh-TW","ar","de","id","ko","it","vi"]} />
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

              {/* BurrowSoft branding */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <a
                    href="https://burrowsoft.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                    aria-label="BurrowSoft"
                  >
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
                      ].map((p) => (
                        <li key={p.label}>
                          <a
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-rose-500 transition-colors"
                          >
                            {p.label}
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
          <RegionalFloatingAd />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
