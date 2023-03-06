import { component$ } from "@builder.io/qwik";
import type ArticleType from "~/modules/shared/types/ArticleType";

interface TableProps<> {
  data?: ArticleType[];
}
type HeadingKeys = keyof ArticleType;

export default component$<TableProps>(({ data }) => {
  const headings: HeadingKeys[] =
    data && data.length ? (Object.keys(data[0]) as HeadingKeys[]) : [];
  const rows = data || [];

  return (
    <div class="overflow-x-auto w-full py-8">
      <table class="table w-full">
        <thead>
          <tr>
            <th></th>
            {headings.map((heading) => {
              const isLink = heading === "link";
              const isDate =
                typeof heading === "string" && heading.includes("Date");

              if (isDate) {
                // @ts-expect-error
                heading = heading.replace("Date", " Date");
              }

              if (isLink) return null;

              return <th key={heading}>{heading}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <th>{index}</th>
              {headings.map((heading) => {
                const isTags = heading === "tags";
                const isTitle = heading === "title";
                const isLink = heading === "link";

                if (isLink) return null;

                const renderCell = () => {
                  if (isTags) {
                    return (
                      <div class="flex flex-wrap gap-1">
                        {row[heading].map((tag) => (
                          <span key={tag} class="badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    );
                  }

                  if (isTitle && row.link) {
                    return (
                      <a
                        target="_blank"
                        href={row.link}
                        class="link link-accent"
                      >
                        {row[heading]}
                      </a>
                    );
                  }

                  return row[heading] || "N/A";
                };

                return <td key={heading}>{renderCell()}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
