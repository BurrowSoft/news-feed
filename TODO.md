# InsightMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `GNEWS_API_KEY` — GNews (primary — free tier includes images ✓)
- `NEWS_API_KEY` — NewsAPI.org (deprioritised — free tier does NOT return article images; treat as text-only fallback or upgrade the plan)
- `OPENAI_API_KEY` — AI summaries

## ⚠️ NewsAPI Free Tier: No Images
NewsAPI's free plan strips `urlToImage` from responses. Do not rely on it for article thumbnails. GNews and The Guardian both provide images on their free tiers and should be treated as the primary sources. If the account is on a paid NewsAPI plan, images will work — verify before writing the image-display code.

## Architecture: Client-Driven Fetching
All news fetching must go through a Next.js API route (`/api/news`) rather than directly in server components. This enables the client to drive the loading overlay.

Pattern:
1. Page load / category change → client calls `/api/news?category=...`
2. API route fans out to all providers concurrently via `ProviderRouter`
3. Client shows the loading overlay per provider
4. Results return as JSON; client renders the feed

Wrap every provider call with `unstable_cache` from `next/cache` (TTL: 15 min / `revalidate: 900`). Cache key = category + country. News does not need a price-refresh loop.

## Tasks

### 1. Article images
GNews returns `image`, The Guardian returns `fields.thumbnail`. NewsAPI returns `urlToImage` only on paid plans.
- Ensure the article card displays the thumbnail from whichever provider returned it
- Use Next.js `<Image>` with proper domain whitelisting in `next.config.ts`
- Fall back to a placeholder if no image

### 2. Category / topic filtering
Both providers support category params (business, technology, sports, entertainment, health, science).
- Add a category filter bar to the top of the feed
- Pass selected category into the provider search params

### 3. Article detail / full read
Currently likely just links out to the source. Consider:
- Showing a proper article preview page at `/article/[id]` with full metadata (author, published date, source logo, description)
- "Read full article" button opens the original URL in a new tab

### 4. Add The Guardian as a third provider (free, no RapidAPI needed)
The Guardian has a free public API: `https://open-platform.theguardian.com/`
- Requires new env var: `GUARDIAN_API_KEY` — register free at open-platform.theguardian.com, add to Vercel and `.env.example`
- File: create `packages/shared/src/providers/news/guardian.ts`
- Implement `GuardianNewsProvider` and register in `createNewsRouter()`
- Provides article thumbnails, section tags, full body text

### 5. Loading overlay — show while APIs are fetching
The feed page must show a loading overlay while provider calls are in flight. Requirements:
- Each active provider fetches concurrently; the overlay displays one animated line per provider, e.g. "Loading news from GNews…" / "Loading news from The Guardian…" / "Loading news from NewsAPI…"
- As each provider resolves, its line gets a checkmark and articles stream in
- If a provider fails, its line shows "[Provider] unavailable" in muted text
- Implement as a client component (`<NewsLoadingOverlay providers={string[]} />`)
- Overlay fades out once all providers have settled

### 6. Source badges and "Read on [Source]" buttons
Every article card must clearly show its origin and link back to it. Requirements:
- Source logo or name badge on each card (GNews and Guardian both return source names)
- "Read on [Source name]" button that opens the original article URL in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Do not attempt to embed or proxy the full article — just link out

### 7. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, hotel-booking, rent-a-car, main-website, games, shopping.
