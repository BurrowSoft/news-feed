# InsightMole — TODO3: Thai Localisation + Language Selector

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports3.md when done.

## Overview
When a user visits from Thailand (`x-vercel-ip-country: TH`), the app defaults to Thai language and fetches Thai-language news. All users get a language selector (EN / TH) in the header.

## Architecture: `next-intl` with cookie-based locale (no URL changes)
- Install `next-intl`
- Messages: `src/messages/en.json` and `src/messages/th.json`
- Locale in `NEXT_LOCALE` cookie
- Locale detection: cookie → `detectCountry()` → TH defaults to `th`, else `en`

## Tasks

### 1. Install and configure next-intl
```bash
npm install next-intl
```
- `src/i18n.ts`, `src/middleware.ts`, wrap layout with `NextIntlClientProvider`

### 2. Translation files

**`src/messages/en.json`**
```json
{
  "nav": { "home": "InsightMole", "feed": "News Feed" },
  "hero": { "title": "Stay Informed. No Noise.", "subtitle": "Top stories from trusted sources worldwide." },
  "categories": {
    "top": "Top Stories", "business": "Business", "technology": "Technology",
    "sports": "Sports", "entertainment": "Entertainment", "health": "Health", "science": "Science"
  },
  "article": {
    "readOn": "Read on {source}",
    "loading": "Loading news from {provider}…",
    "unavailable": "{provider} unavailable",
    "noneFound": "No articles found.",
    "aiSummary": "AI Briefing",
    "poweredBy": "Powered by gpt-4o-mini"
  },
  "footer": { "tagline": "Digging deep. Building solutions." }
}
```

**`src/messages/th.json`**
```json
{
  "nav": { "home": "InsightMole", "feed": "ฟีดข่าว" },
  "hero": { "title": "รู้ทันข่าว ไม่มีสิ่งรบกวน", "subtitle": "ข่าวเด่นจากแหล่งข่าวที่เชื่อถือได้ทั่วโลก" },
  "categories": {
    "top": "ข่าวเด่น", "business": "ธุรกิจ", "technology": "เทคโนโลยี",
    "sports": "กีฬา", "entertainment": "บันเทิง", "health": "สุขภาพ", "science": "วิทยาศาสตร์"
  },
  "article": {
    "readOn": "อ่านที่ {source}",
    "loading": "กำลังโหลดข่าวจาก {provider}…",
    "unavailable": "{provider} ไม่พร้อมใช้งาน",
    "noneFound": "ไม่พบบทความ",
    "aiSummary": "สรุปข่าวโดย AI",
    "poweredBy": "ขับเคลื่อนโดย gpt-4o-mini"
  },
  "footer": { "tagline": "ค้นหาลึก สร้างสรรค์โซลูชัน" }
}
```

### 3. Thai news sources
When locale is `th`, pass `language: "th"` and `country: "TH"` to the news providers:
- GNews supports `lang=th&country=th` parameters
- NewsAPI supports `language=th`
- The Guardian does not have Thai content — skip it when locale is `th`

Update the `/api/news` route to pass the locale/language param from the cookie header into provider search params.

### 4. Language selector component
`src/components/LanguageSelector.tsx` — 🇬🇧 EN / 🇹🇭 TH, sets `NEXT_LOCALE` cookie + `router.refresh()`.

### 5. Replace hardcoded strings
Priority: `layout.tsx`, `NewsFeed.tsx`, `NewsCard.tsx`, `AISummaryCard.tsx`, `NewsLoadingOverlay.tsx`.

### 6. Thai font support
```tsx
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"] });
```
