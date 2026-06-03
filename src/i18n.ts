import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const LOCALES = [
  "en", "th", "es", "ru", "pt-BR", "fr",
  "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
] as const;
export type Locale = (typeof LOCALES)[number];

const COUNTRY_LOCALE: Record<string, Locale> = {
  TH: "th",
  // Spanish
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  // Portuguese (Brazil)
  BR: "pt-BR", PT: "pt-BR",
  // French
  FR: "fr", BE: "fr", CH: "fr", CA: "fr",
  // Japanese
  JP: "ja",
  // Chinese Simplified
  CN: "zh",
  // Chinese Traditional
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", KW: "ar", QA: "ar",
  BH: "ar", OM: "ar", JO: "ar", LB: "ar", MA: "ar",
  // German
  DE: "de", AT: "de",
  // Indonesian
  ID: "id",
  // Korean
  KR: "ko",
  // Italian
  IT: "it",
  // Vietnamese
  VN: "vi",
  // Russian
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru",
};

function resolveLocale(cookieLocale: string | undefined, country: string): Locale {
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }
  return COUNTRY_LOCALE[country] ?? "en";
}

async function loadMessages(locale: Locale) {
  switch (locale) {
    case "th":    return (await import("./messages/th.json")).default;
    case "es":    return (await import("./messages/es.json")).default;
    case "ru":    return (await import("./messages/ru.json")).default;
    case "pt-BR": return (await import("./messages/pt-BR.json")).default;
    case "fr":    return (await import("./messages/fr.json")).default;
    case "ja":    return (await import("./messages/ja.json")).default;
    case "zh":    return (await import("./messages/zh.json")).default;
    case "zh-TW": return (await import("./messages/zh-TW.json")).default;
    case "ar":    return (await import("./messages/ar.json")).default;
    case "de":    return (await import("./messages/de.json")).default;
    case "id":    return (await import("./messages/id.json")).default;
    case "ko":    return (await import("./messages/ko.json")).default;
    case "it":    return (await import("./messages/it.json")).default;
    case "vi":    return (await import("./messages/vi.json")).default;
    default:      return (await import("./messages/en.json")).default;
  }
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const hdrs = await headers();
  const country = hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? "US";

  const locale = resolveLocale(cookieLocale, country);

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
