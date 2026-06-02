# InsightMole — Thailand News API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Source | Registration | Notes |
|---|---|---|
| **NewsData.io** | https://newsdata.io/ | 200 req/day free. `country=th&language=th` for Thai-language news. |
| **MediaStack** | https://mediastack.com/ | 500 req/month free. `countries=th&languages=th`. |
| **Bangkok Post RSS** | No registration | Free. Multiple feeds at https://www.bangkokpost.com/rss/ |

New env vars: `NEWSDATA_API_KEY`, `MEDIASTACK_API_KEY` (same keys also serve Brazil).

## Tasks

### 1. BangkokPostRSSProvider
File: `packages/shared/src/providers/news/bangkokpost.ts`
Feeds:
- Breaking: `https://www.bangkokpost.com/rss/data/breakingnews.xml`
- Business: `https://www.bangkokpost.com/rss/data/business.xml`
- Sports: `https://www.bangkokpost.com/rss/data/sports.xml`
- Tech: `https://www.bangkokpost.com/rss/data/tech.xml`
- Top stories: `https://www.bangkokpost.com/rss/data/topstories.xml`

Parse XML with `fast-xml-parser`. Normalize to `NewsArticle` DTO. `source.name = "Bangkok Post"`. Cache `revalidate: 900`.

### 2. NewsDataProvider
File: `packages/shared/src/providers/news/newsdata.ts`
- `GET https://newsdata.io/api/1/news?apikey=...&country=th&language=th&category={category}`
- Fields: `title`, `description`, `link`, `image_url`, `pubDate`, `source_name`

### 3. MediaStackProvider
File: `packages/shared/src/providers/news/mediastack.ts`
- `GET http://api.mediastack.com/v1/news?access_key=...&countries=th&languages=th&categories={category}&limit=20`

### 4. createNewsRouter for Thailand
```ts
if (country === "TH") {
  providers.push(new BangkokPostRSSProvider()); // no key
  if (NEWSDATA_API_KEY) providers.push(new NewsDataProvider(key, "TH", "th"));
  if (MEDIASTACK_API_KEY) providers.push(new MediaStackProvider(key, "th", "th"));
  // Guardian: skip (no Thai content)
}
```
