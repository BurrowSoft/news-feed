export type { NewsArticle } from "@burrowsoft/shared";

import { createNewsRouter } from "@burrowsoft/shared";
import type { NewsArticle, NewsSearchParams } from "@burrowsoft/shared";

export async function getTopHeadlines(
  country = "US",
  pageSize = 30
): Promise<NewsArticle[]> {
  const router = createNewsRouter();
  const params: NewsSearchParams = { pageSize, country };
  return router.search(params, country);
}
