# InsightMole — TODO2 (Follow-up improvements)

## Permissions
Ask the user to enable bypass permissions before starting: Claude Code settings → permission mode "bypass", or `claude --dangerously-skip-permissions`.

## Tasks

### 1. AI summary above article grid
Use the shared `summarize()` function from `@burrowsoft/shared` to generate a short briefing above the article results.

Requirements:
- After `/api/news` resolves, pass the top 10 articles + the user's detected country to `summarize("news", articles, country)`
- Display the summary as a highlighted card above the article grid — e.g. "Here's what's happening today in [Country]: [2–3 sentence briefing]"
- The summary should update when the user switches categories (new `summarize()` call per category change)
- Show a subtle skeleton/loading state for the summary card while it loads (it resolves after the article grid, so don't block articles from appearing)
- Requires `OPENAI_API_KEY` to be set — gracefully hide the summary card if the env var is missing

Implementation notes:
- `summarize()` is already exported from `@burrowsoft/shared` — check `packages/shared/src/ai/index.ts` for the signature
- Make the summary call from the `/api/news` route (server-side) alongside the provider calls, not client-side, to keep the API key server-only
- Return it in the `/api/news` response as `{ articles, providers, summary }` — the client renders it when it arrives
