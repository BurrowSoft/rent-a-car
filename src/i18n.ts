import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  let locale: string;
  if (cookieLocale === "th") {
    locale = "th";
  } else if (cookieLocale === "en") {
    locale = "en";
  } else {
    const hdrs = await headers();
    const country =
      hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? "US";
    locale = country === "TH" ? "th" : "en";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
