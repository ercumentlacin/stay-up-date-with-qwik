import type { RequestHandler } from "@builder.io/qwik-city";
import buildArticle from "~/modules/smashingmagazine/buildArticle";

export const onGet: RequestHandler = async ({ send }) => {
  const result = await buildArticle({ page: "1", tag: "javascript"});
  const response = new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json",
    },
  });
  send(response);
};