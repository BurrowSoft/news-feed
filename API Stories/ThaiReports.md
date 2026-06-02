# news-feed — Thailand Localisation Report

## Localisation status (TODO3 + TODO4)

**Complete.** All UI strings translated EN/TH. Thai font loaded. Language selector in header.

### Translation coverage

| Component | Keys translated |
|---|---|
| `NewsFeed` | Category pills (7), "no articles found" |
| `NewsCard` | "Read on {source}" |
| `AISummaryCard` | "AI Briefing", "Powered by gpt-4o-mini" |
| `NewsLoadingOverlay` | "Loading news from {provider}…", "{provider} unavailable" |
| `page.tsx` (hero) | subtitle |
| `article/[id]/page.tsx` | "Back to {siteName}", "via {provider}", "Read full article on {source}" |

### Thai news sources

When `locale=th` the `/api/news` route:
- Uses `language="th"`, `country="TH"`
- Skips The Guardian (no Thai content)
- GNews: `lang=th&country=th`
- NewsAPI: `language=th`

### Thai affiliate ads

Shared `RegionalFloatingAd` (from `@burrowsoft/shared`) rendered in `layout.tsx` inside `NextIntlClientProvider`.
Visible only when `useLocale() === "th"` (keyed off `REGIONAL_ADS["th"]` in the shared config), dismissible per session.
Links configured centrally in `packages/shared/src/components/RegionalFloatingAd.tsx`:
- `https://s.lazada.co.th/s.ZhTKMF?c=b&t=p-i6RvCVf-sRab381`
- `https://s.lazada.co.th/s.ZhTKLe?c=a&t=p-iHa6GOt-s2EYQBV0`

To update ad copy or add new links: edit `REGIONAL_ADS["th"]` in the shared package and re-sync to all apps.

---

## Pending: Thai news API integration (Thai.md)

The following providers are planned — see `Thai.md` for full specs.
Register API keys and set Vercel env vars before starting.

| Provider | Env var | Status |
|---|---|---|
| Bangkok Post RSS | none | not started |
| NewsData.io | `NEWSDATA_API_KEY` | not started — register at newsdata.io |
| MediaStack | `MEDIASTACK_API_KEY` | not started — register at mediastack.com |
