import { headers } from "next/headers";
import { NewsFeed } from "@/components/NewsFeed";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { detectCountry } from "@burrowsoft/shared";

export default async function HomePage() {
  const hdrs = await headers();
  const country = detectCountry(Object.fromEntries(hdrs.entries()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{SITE_NAME}</h1>
        <p className="mt-1 text-slate-500">{SITE_DESCRIPTION}</p>
      </div>
      <NewsFeed country={country} />
    </div>
  );
}
