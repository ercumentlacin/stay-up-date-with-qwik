import type BuilderArticleType from "../shared/types/BuilderArticleType";

export default async function fetchArticles({ page, tag }: BuilderArticleType): Promise<string | never> {
  try {
    let uri = `https://www.smashingmagazine.com/category/${tag}/`;

    if (Number(page) > 1) {
      uri = `https://www.smashingmagazine.com/category/${tag}/page/${page}/`;
    }

    const response = await fetch(uri);
    const content = await response.text();
    return content;
  } catch (error: unknown) {
    const e = error as Error;
    throw new Error(e.message || "Error fetching articles");
  }
}