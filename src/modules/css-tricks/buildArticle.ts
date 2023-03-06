import * as cheerio from "cheerio";
import * as htmlparser2 from "htmlparser2";
import { formatDate } from "~/utils/date";
import type ArticleType from "../shared/types/ArticleType";
import type BuilderArticleType from "../shared/types/BuilderArticleType";
import fetchArticles from "./fetchArticles";


const buildArticle = async ({ page, tag }: BuilderArticleType) => {
  try {
    const content = await fetchArticles({ page, tag });

    const dom = htmlparser2.parseDocument(content, {});
    const $ = cheerio.load(dom);

    const articles: ArticleType[] = [];

    const builder = (_i: number, el: cheerio.Element) => {
      const $el = $(el);
      const title = $el.find("h2").text().trim();
      const link = $el.find("h2 a").attr("href") as string;
      const date = $el.find("time").text().trim();
      const tags = $el.find(".tags a").map((i, el) => $(el).text().trim()).get();

      const [createdDate, updatedDate] = date.split(/\s{2,}/g);

      const item: ArticleType = {
        title,
        link,
        tags,
        site: "css-tricks",
        createdDate: formatDate(createdDate) as string,
        updatedDate: formatDate(updatedDate),
      };

      articles.push(item);
    };

    $(".article-card.article").each(builder);

    return { error: false, articles };
  } catch (error) {
    const e = error as Error;
    return { error: e.message || "Error building article", articles: [] };
  }
};

export default buildArticle;
