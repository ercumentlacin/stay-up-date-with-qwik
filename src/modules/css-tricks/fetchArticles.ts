import type BuilderArticleType from "../shared/types/BuilderArticleType";

export default async function fetchArticles({ page, tag }: BuilderArticleType): Promise<string | never> {
  try {
    const response = await fetch(`https://css-tricks.com/tag/${tag}/page/${page}/`);
    const content = await response.text();
    return content;
  } catch (error: unknown) {
    const e = error as Error;
    throw new Error(e.message || "Error fetching articles");
  }
}