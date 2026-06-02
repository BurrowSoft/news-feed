# InsightMole — TODO4: Complete Thai/Portuguese Localisation

Finish translation coverage and adopt the shared `LanguageSelector` dropdown component.

## Replace LanguageSelector with shared component
Delete `src/components/LanguageSelector.tsx`. In `layout.tsx`:
```tsx
import { LanguageSelector } from "@burrowsoft/shared";
<LanguageSelector locales={["en", "th"]} />
```

## Wire form/filter labels (if pending)
Add `useTranslations("categories")` and replace category filter labels if not yet wired:
- `"Top"`, `"Business"`, `"Technology"`, `"Sports"`, `"Entertainment"`, `"Health"`, `"Science"`

## Translate page-level hero
- `page.tsx` hero title/subtitle (if still hardcoded)

## Verify article detail page
- `app/article/[id]/page.tsx` — back-link label, metadata labels (if hardcoded)

## Test end-to-end
1. Load page in EN
2. Switch locale dropdown to TH — verify Thai render + Sarabun font + Thai news category labels
3. Switch back to EN
4. Reload — verify cookie persists

## Fill in ThaiReports.md
Document translation coverage. Link to `API Stories/Thai.md` for later API work (Bangkok Post RSS, NewsData, MediaStack, etc.).

---

**API work:** See `API Stories/Thai.md` and `API Stories/Brazil.md` (start after localisation is complete).
