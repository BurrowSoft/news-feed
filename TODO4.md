# InsightMole — TODO4: Thailand/SEA Region-Specific News APIs

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports4.md when done.

## Overview
When a user is in Thailand, InsightMole should surface Thai news sources alongside global providers. Bangkok Post RSS is free with no registration. NewsData.io supports country=TH filtering. MediaStack also supports Thai news. GNews already supports lang=th&country=th (wired in TODO3).

---

## What the user needs to arrange first

| Source | Registration | Notes |
|---|---|---|
| **NewsData.io** | https://newsdata.io/ | Free tier: 200 requests/day. Supports `country=th`, `language=th`. Better Thai coverage than NewsAPI. |
| **MediaStack** | https://mediastack.com/ | Free tier: 500 requests/month. Supports `countries=th`. Broad category support. |
| **Bangkok Post RSS** | No registration | Free, no auth. Multiple feeds available at https://www.bangkokpost.com/rss/ |

New env vars to add to Vercel (news-feed project):
- `NEWSDATA_API_KEY` (from newsdata.io)
- `MEDIASTACK_API_KEY` (from mediastack.com)
- Bangkok Post RSS requires no key

---

## Architecture
Add three new providers, all gated on country === "TH" (or broader SEA/regional logic):
- `BangkokPostRSSProvider` — always available, no key needed, English Thai news
- `NewsDataProvider` — requires key, supports Thai + English, country filter
- `MediaStackProvider` — requires key, category support, country filter

In `createNewsRouter(country)`:
```ts
if (country === "TH") {
  providers.push(new BangkokPostRSSProvider());         // always, no key
  if (process.env.NEWSDATA_API_KEY)
    providers.push(new NewsDataProvider(process.env.NEWSDATA_API_KEY, country));
  if (process.env.MEDIASTACK_API_KEY)
    providers.push(new MediaStackProvider(process.env.MEDIASTACK_API_KEY, country));
}
// Always add GNews + NewsAPI + Guardian (existing)
```

---

## Tasks

### 1. BangkokPostRSSProvider
File: `packages/shared/src/providers/news/bangkokpost.ts`

Bangkok Post RSS feeds:
- Breaking news: `https://www.bangkokpost.com/rss/data/breakingnews.xml`
- Business: `https://www.bangkokpost.com/rss/data/business.xml`
- Sports: `https://www.bangkokpost.com/rss/data/sports.xml`
- Tech: `https://www.bangkokpost.com/rss/data/tech.xml`
- Top stories: `https://www.bangkokpost.com/rss/data/topstories.xml`

Use the built-in `fetch` to get RSS XML. Parse with a lightweight XML parser (`fast-xml-parser` or similar — check if already in dependencies, otherwise add it).

Map RSS fields to `NewsArticle` DTO:
- `title` → `title`
- `description` → `description`
- `link` → `url`
- `pubDate` → `publishedAt`
- `enclosure[url]` or `media:content[url]` → `imageUrl`
- `source.name` = "Bangkok Post"

Cache with `next: { revalidate: 900 }`.

### 2. NewsDataProvider
File: `packages/shared/src/providers/news/newsdata.ts`

NewsData.io API:
- Base URL: `https://newsdata.io/api/1/news`
- Auth: `apikey` query param
- Search: `GET /news?apikey=...&country=th&language=en&category=top`
- Categories: `top`, `business`, `technology`, `sports`, `entertainment`, `health`, `science`
- Response fields: `title`, `description`, `link`, `image_url`, `pubDate`, `source_name`, `source_icon`
- Normalize to `NewsArticle` DTO
- Rate limit: 200 req/day on free tier — use `revalidate: 900` to stay well within limits

### 3. MediaStackProvider
File: `packages/shared/src/providers/news/mediastack.ts`

MediaStack API:
- Base URL: `http://api.mediastack.com/v1/news` (note: HTTP on free tier, HTTPS on paid)
- Auth: `access_key` query param
- Search: `GET /news?access_key=...&countries=th&languages=en&categories=general&limit=20`
- Response fields: `title`, `description`, `url`, `image`, `published_at`, `source`
- Normalize to `NewsArticle` DTO

### 4. Update createNewsRouter to accept country
File: `packages/shared/src/providers/news/index.ts`
- Accept `country` param
- Gate Thai providers on `country === "TH"`
- Update `news-feed/src/app/api/news/route.ts` to pass country from `detectCountry(headers)`

### 5. Source badges for Thai providers
The `NewsCard` source badge should show "Bangkok Post", "NewsData", "MediaStack" correctly using the `source.name` field already in the `NewsArticle` DTO.

### 6. Sync packages/shared to all apps after changes
After editing any shared news provider file, copy `packages/shared/` to: flight-booking, hotel-booking, rent-a-car, main-website, games, shopping.

---

## Brazil Region (country === "BR")

### What the user needs to arrange

| Source | Registration | Notes |
|---|---|---|
| **NewsData.io** | https://newsdata.io/ | Same registration as Thailand. Pass `country=br&language=pt` for Portuguese Brazilian news. 200 req/day free. |
| **MediaStack** | https://mediastack.com/ | Same registration as Thailand. Pass `countries=br&languages=pt`. 500 req/month free. |
| **G1 RSS (Globo)** | No registration | Free RSS feeds. Breaking news, business, tech, sports, etc. Brazilian Portuguese. |

New env vars: none needed beyond what Thailand already requires (`NEWSDATA_API_KEY`, `MEDIASTACK_API_KEY` — same keys work for Brazil).

### G1RSSProvider (implement first — free, no key)
File: `packages/shared/src/providers/news/g1rss.ts`

G1 RSS feeds:
- Breaking news: `https://g1.globo.com/rss/g1/index.xml`
- Economy: `https://g1.globo.com/rss/g1/economia/index.xml`
- Technology: `https://g1.globo.com/rss/g1/tecnologia/index.xml`
- Sports: `https://g1.globo.com/rss/g1/esportes/index.xml`
- Politics: `https://g1.globo.com/rss/g1/politica/index.xml`
- Health: `https://g1.globo.com/rss/g1/bemestar/index.xml`

Implementation: same pattern as `BangkokPostRSSProvider` — fetch XML, parse with `fast-xml-parser`, normalize to `NewsArticle` DTO.
- `source.name` = "G1 Globo"
- `language` = "pt"
- Cache: `next: { revalidate: 900 }`

### Update createNewsRouter for Brazil
```ts
if (country === "BR") {
  providers.push(new G1RSSProvider());  // always, no key
  if (process.env.NEWSDATA_API_KEY)
    providers.push(new NewsDataProvider(process.env.NEWSDATA_API_KEY, "BR", "pt"));
  if (process.env.MEDIASTACK_API_KEY)
    providers.push(new MediaStackProvider(process.env.MEDIASTACK_API_KEY, "br", "pt"));
}
```

### NewsData + MediaStack Brazil params
Both providers already implemented for Thailand (tasks 2 + 3 above). Extend them to accept a `language` param:
- NewsData: add `language=pt` when country is BR
- MediaStack: add `languages=pt` when country is BR
- The Guardian: skip for Brazil (no Portuguese content)
