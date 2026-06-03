import { getRequestConfig } from "next-intl/server";

export const LOCALES = [
  "en", "th", "es", "ru", "pt-BR", "fr",
  "ja", "zh", "zh-TW", "ar", "de", "id", "ko", "it", "vi",
] as const;

export type Locale = (typeof LOCALES)[number];

function isValidLocale(v: string | undefined): v is Locale {
  return LOCALES.includes(v as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = isValidLocale(requested) ? requested : "en";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
