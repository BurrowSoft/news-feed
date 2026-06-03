import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsFeed } from "@/components/NewsFeed";
import { SITE_NAME } from "@/lib/seo";
import { detectCountry } from "@burrowsoft/shared";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));
  const t = await getTranslations("hero");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{SITE_NAME}</h1>
        <p className="mt-1 text-slate-500">{t("subtitle")}</p>
      </div>
      <NewsFeed country={country} locale={locale} />
    </div>
  );
}
