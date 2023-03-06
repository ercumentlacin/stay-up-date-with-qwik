import { loader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { component$, useBrowserVisibleTask$, useStore, useTask$ } from "@builder.io/qwik";
import cssTricks from "~/modules/css-tricks/buildArticle";
import smashingmagazine from "~/modules/smashingmagazine/buildArticle";
import Table from "~/components/table";
import debounce from "~/utils/debounce";
import type ArticleType from "~/modules/shared/types/ArticleType";

export const useCssTricksArticles = loader$(async ({ query }) => {
  const page = query.get("page") || "1";
  const tag = query.get("tag") || "javascript";

  const smashingmagazineArticles = await smashingmagazine({ page, tag });
  const cssTricksArticles = await cssTricks({ page, tag });

  return {
    articles: [
      ...cssTricksArticles.articles,
      ...smashingmagazineArticles.articles,
    ],
    "CSS Tricks": cssTricksArticles.articles,
    "Smashing Magazine": smashingmagazineArticles.articles,
    page,
    tag,
  };
});

type WebSitesType = "CSS Tricks" | "Smashing Magazine"


export default component$(() => {
  const signal = useCssTricksArticles();
  const navigate = useNavigate();
  const loc = useLocation();
  const store = useStore({
    currentPage: signal.value?.page,
    isLoading: false,
    tag: signal.value?.tag,
    webSites: [
      { key: "CSS Tricks", value: true },
      { key: "Smashing Magazine", value: true },
    ],
  });

  const storeOfArticle = useStore<{article: ArticleType[]}>({
    article: [],
  });

  useTask$(({ track }) => {
    track(() => store.webSites);

    storeOfArticle.article = store.webSites.reduce((acc, webSite) => {
      if (webSite.value && signal.value) {
        acc.push(...signal.value[webSite.key as WebSitesType]);
      }
      return acc;
    }, [] as ArticleType[]);
  });


  useBrowserVisibleTask$(({ track }) => {
    const currentPage = track(() => store.currentPage);
    const tag = track(() => store.tag);

    const uri = new URL(loc.url);
    uri.searchParams.set("page", currentPage);
    uri.searchParams.set("tag", tag);

    store.isLoading = true;

    const [debouncedNavigate] = debounce(() => navigate(uri.toString()), 300);

    debouncedNavigate().finally(() => (store.isLoading = false));
  });

  return (
    <div>
      <div class="flex justify-center py-4 gap-2">
        {store.webSites.map(({ key, value }) => {
          return (
            <div class="form-control" key={key}>
              <label class="cursor-pointer label space-x-4">
                <span class="label-text">{key}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent"
                  checked={value}
                  onChange$={(event) => {
                    store.webSites = store.webSites.map((webSite) => {
                      if (webSite.key === key) {
                        webSite.value = event.target.checked;
                      }
                      return webSite;
                    });
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>
      <Table data={storeOfArticle.article} />
      <div class="btn-group flex justify-center">
        <button
          disabled={store.isLoading || store.currentPage === "1"}
          onClick$={() => {
            store.currentPage = (Number(store.currentPage) - 1).toString();
          }}
          class="btn"
        >
          «
        </button>
        <button class="btn">Page {store.currentPage}</button>
        <button
          disabled={
            store.isLoading ||
            !signal.value?.articles ||
            !signal.value?.articles.length
          }
          onClick$={() => {
            store.currentPage = (Number(store.currentPage) + 1).toString();
          }}
          class="btn"
        >
          »
        </button>
      </div>
    </div>
  );
});
