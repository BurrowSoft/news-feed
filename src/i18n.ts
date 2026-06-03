import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const LOCALES = [
  "en", "th", "es", "ru", "pt-BR", "fr",
  "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
] as const;

export type Locale = (typeof LOCALES)[number];

const COUNTRY_LOCALE: Record<string, Locale> = {
  TH: "th",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  BR: "pt-BR", PT: "pt-BR",
  FR: "fr", BE: "fr", CH: "fr", CA: "fr",
  JP: "ja",
  CN: "zh",
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  SA: "ar", AE: "ar", EG: "ar", KW: "ar", QA: "ar",
  BH: "ar", OM: "ar", JO: "ar", LB: "ar", MA: "ar",
  DE: "de", AT: "de",
  ID: "id",
  KR: "ko",
  IT: "it",
  VN: "vi",
  RU: "ru", UA: "ru", KZ: "ru", BY: "ru",
};

function isValidLocale(v: string | undefined): v is Locale {
  return LOCALES.includes(v as Locale);
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
  const hdrs = await headers();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const country = hdrs.get("x-vercel-ip-country") ?? hdrs.get("cf-ipcountry") ?? "US";

  const locale: Locale = isValidLocale(cookieLocale)
    ? cookieLocale
    : (COUNTRY_LOCALE[country] ?? "en");

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
