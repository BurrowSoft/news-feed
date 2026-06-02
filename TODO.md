# InsightMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `GNEWS_API_KEY` — GNews (backup provider, already wired)
- `NEWS_API_KEY` — NewsAPI.org (primary provider, already wired) — note: NOT visible in Vercel screenshot, confirm it is set
- `OPENAI_API_KEY` — AI summaries

## Tasks

### 1. Confirm NEWS_API_KEY is set on Vercel
It was not visible in the Vercel env vars screenshot. Verify it exists in the Vercel project settings (it may just have been off-screen). If missing, add it.

### 2. Article images
Both NewsAPI and GNews return `urlToImage` (NewsAPI) and `image` (GNews) fields.
- Ensure the article card displays the article thumbnail
- Use Next.js `<Image>` with proper domain whitelisting in `next.config.ts` (add `*.googleusercontent.com`, news CDN domains as needed)
- Fall back to a placeholder if no image

### 3. Category / topic filtering
Both providers support category params (business, technology, sports, entertainment, health, science).
- Add a category filter bar to the top of the feed
- Pass selected category into the provider search params

### 4. Article detail / full read
Currently likely just links out to the source. Consider:
- Showing a proper article preview page at `/article/[id]` with full metadata (author, published date, source logo, description)
- "Read full article" button opens the original URL in a new tab

### 5. Add The Guardian as a third provider (free, no RapidAPI needed)
The Guardian has a free public API: `https://open-platform.theguardian.com/`
- Requires new env var: `GUARDIAN_API_KEY` — register free at open-platform.theguardian.com, add to Vercel and `.env.example`
- File: create `packages/shared/src/providers/news/guardian.ts`
- Implement `GuardianNewsProvider` and register in `createNewsRouter()`
- Provides article thumbnails, section tags, full body text

### 6. Loading overlay — show while APIs are fetching
The feed page must show a loading overlay while provider calls are in flight. Requirements:
- Each active provider fetches concurrently; the overlay displays one animated line per provider, e.g. "Loading news from NewsAPI…" / "Loading news from GNews…" / "Loading news from The Guardian…"
- As each provider resolves, its line gets a checkmark and articles stream in
- If a provider fails, its line shows "[Provider] unavailable" in muted text
- Implement as a client component (`<NewsLoadingOverlay providers={string[]} />`)
- Overlay fades out once all providers have settled

### 7. Source badges and "Read on [Source]" buttons
Every article card must clearly show its origin and link back to it. Requirements:
- Source logo or name badge on each card (NewsAPI and GNews both return `source.name`)
- "Read on [Source name]" button that opens the original article URL in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Do not attempt to embed or proxy the full article — just link out

### 8. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, hotel-booking, rent-a-car, main-website, games, shopping.
