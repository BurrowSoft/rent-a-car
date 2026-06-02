import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Compare & Book Rental Cars Worldwide`,
    description: SITE_DESCRIPTION,
  },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
            aria-label="Main navigation"
          >
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-rose-500">
              <span aria-hidden>🚗</span>
              {SITE_NAME}
            </Link>
            <span className="hidden sm:block text-xs text-slate-400">
              Compare cars from top suppliers
            </span>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Popular</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">New York</span></li>
                  <li><span className="text-slate-400">Los Angeles</span></li>
                  <li><span className="text-slate-400">Miami</span></li>
                  <li><span className="text-slate-400">London</span></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Europe</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">Paris</span></li>
                  <li><span className="text-slate-400">Barcelona</span></li>
                  <li><span className="text-slate-400">Rome</span></li>
                  <li><span className="text-slate-400">Amsterdam</span></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Asia & Pacific</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">Dubai</span></li>
                  <li><span className="text-slate-400">Bangkok</span></li>
                  <li><span className="text-slate-400">Tokyo</span></li>
                  <li><span className="text-slate-400">Sydney</span></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Help</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><span className="text-slate-400">Insurance info</span></li>
                  <li><span className="text-slate-400">Cancellation policy</span></li>
                  <li>
                    <a href="mailto:support@rentacarmole.com" className="hover:text-rose-500 transition-colors">
                      support@rentacarmole.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
