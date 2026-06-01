export interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { id: string | null; name: string };
  author: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export async function getTopHeadlines(pageSize = 30): Promise<Article[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];

  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=${pageSize}&apiKey=${key}`,
    { next: { revalidate: 900 } }
  );

  if (!res.ok) return [];

  const data: NewsApiResponse = await res.json();
  return data.articles.filter(
    (a) => a.title !== "[Removed]" && a.url && a.title
  );
}
