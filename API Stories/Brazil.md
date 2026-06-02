# InsightMole — Brazil News API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Source | Registration | Notes |
|---|---|---|
| **NewsData.io** | https://newsdata.io/ | Same key as Thailand. Pass `country=br&language=pt`. |
| **MediaStack** | https://mediastack.com/ | Same key as Thailand. Pass `countries=br&languages=pt`. |
| **G1 Globo RSS** | No registration | Free. Major Brazilian news portal. Portuguese. |

No new env vars — same `NEWSDATA_API_KEY` and `MEDIASTACK_API_KEY` cover Brazil.

## Tasks

### 1. G1RSSProvider
File: `packages/shared/src/providers/news/g1rss.ts`
Feeds:
- Main: `https://g1.globo.com/rss/g1/index.xml`
- Economy: `https://g1.globo.com/rss/g1/economia/index.xml`
- Tech: `https://g1.globo.com/rss/g1/tecnologia/index.xml`
- Sports: `https://g1.globo.com/rss/g1/esportes/index.xml`
- Politics: `https://g1.globo.com/rss/g1/politica/index.xml`
- Health: `https://g1.globo.com/rss/g1/bemestar/index.xml`

Same RSS parsing pattern as `BangkokPostRSSProvider`. `source.name = "G1 Globo"`. `language = "pt"`.

### 2. createNewsRouter for Brazil
```ts
if (country === "BR") {
  providers.push(new G1RSSProvider()); // no key
  if (NEWSDATA_API_KEY) providers.push(new NewsDataProvider(key, "BR", "pt"));
  if (MEDIASTACK_API_KEY) providers.push(new MediaStackProvider(key, "br", "pt"));
  // Guardian: skip (no Portuguese content)
}
```

### 3. NewsData + MediaStack Brazil params
Extend both providers to accept `language` param:
- NewsData: `language=pt` for BR
- MediaStack: `languages=pt` for BR
