# TODO_X: SEO — Google Crawlability & Structured Data

## App: news-feed (https://www.insightmole.com)

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Do NOT fill a Reports file for this TODO. Just commit and push when done.

## Overview
Three SEO tasks. Do all three. Do NOT change any existing functionality, API routes, or UI.

---

## Task 1 — WebSite JSON-LD in layout.tsx

Add a `<script type="application/ld+json">` tag inside the `<body>` of`src/app/layout.tsx`.

`	sx
const WEBSITE_SCHEMA = { /* see App-specific section below */ };

// Inside the layout return, inside <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
/>
`"

---

## Task 2 — hreflang alternate links

Add to the root `metadata` export in `src/app/layout.tsx`:

`	s
alternates: {
  languages: {
    "en": "https://www.insightmole.com",
    "th": "https://www.insightmole.com",
    "es": "https://www.insightmole.com",
    "ru": "https://www.insightmole.com",
    "pt-BR": "https://www.insightmole.com",
    "fr": "https://www.insightmole.com",
    "ja": "https://www.insightmole.com",
    "zh": "https://www.insightmole.com",
    "zh-TW": "https://www.insightmole.com",
    "ar": "https://www.insightmole.com",
    "de": "https://www.insightmole.com",
    "id": "https://www.insightmole.com",
    "ko": "https://www.insightmole.com",
    "it": "https://www.insightmole.com",
    "vi": "https://www.insightmole.com",
    "x-default": "https://www.insightmole.com",
  },
},
`"

---

## Task 3 — robots.ts audit

See App-specific section for exact disallow rules.

---

## App-specific: news-feed

### WebSite schema for Task 1

No SearchAction needed for news — just the WebSite schema:

```ts
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "InsightMole",
  "url": "https://www.insightmole.com",
  "description": "Trending news and top headlines updated around the clock.",
  "publisher": {
    "@type": "Organization",
    "name": "BurrowSoft",
    "url": "https://www.burrowsoft.com"
  }
};
```

### robots.ts — IMPORTANT FIX

The current robots.ts is too permissive (`allow: "/"`).
Fix it to block API and Next.js internal routes:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

### Task 2 note

hreflang alternates apply to the root URL only — same as all other apps.

---

## Commit and push

```bash
git add -A
git commit -m "seo: JSON-LD structured data, hreflang, robots.txt"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```