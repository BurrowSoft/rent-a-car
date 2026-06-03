import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ResultsClient } from "@/components/ResultsClient";
import { SITE_NAME } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const location = str(sp.pickupLocation);
  return {
    title: location ? `Cars in ${location} | ${SITE_NAME}` : `Search Results | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default async function ResultsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const carParams = {
    pickupLocation: str(sp.pickupLocation),
    dropoffLocation: str(sp.dropoffLocation),
    pickupDate: str(sp.pickupDate),
    pickupTime: str(sp.pickupTime) || "10:00",
    dropoffDate: str(sp.dropoffDate),
    dropoffTime: str(sp.dropoffTime) || "10:00",
    driverAge: str(sp.driverAge) || "30",
  };

  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-slate-400">Loading…</div>}>
      <ResultsClient params={carParams} />
    </Suspense>
  );
}
