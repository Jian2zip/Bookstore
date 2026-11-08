import Link from "next/link";
import type { WallFilter, WallSort } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n";

/** URL ⇄ state. `?type=books|goods` and `?sort=newest`; defaults are omitted. */
export function parseWallParams(params: Record<string, string | string[] | undefined>): {
  filter: WallFilter;
  sort: WallSort;
} {
  const type = typeof params.type === "string" ? params.type : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  return {
    filter: type === "books" ? "book" : type === "goods" ? "goods" : "all",
    sort: sort === "newest" ? "newest" : "default",
  };
}

export function wallHref(filter: WallFilter, sort: WallSort): string {
  const q = new URLSearchParams();
  if (filter !== "all") q.set("type", filter === "book" ? "books" : "goods");
  if (sort === "newest") q.set("sort", "newest");
  const s = q.toString();
  return s ? `/?${s}` : "/";
}

/** The one-line text filter row: 全部 / 書 / 雜貨 ……… 最新 */
export function WallFilters({ filter, sort, t }: { filter: WallFilter; sort: WallSort; t: Dictionary["wall"] }) {
  const options: { value: WallFilter; label: string }[] = [
    { value: "all", label: t.all },
    { value: "book", label: t.books },
    { value: "goods", label: t.goods },
  ];
  const linkClass = (active: boolean) =>
    `transition-colors hover:text-fg ${active ? "text-fg underline underline-offset-4" : "text-muted"}`;

  return (
    <nav aria-label={t.filterLabel} className="flex items-baseline justify-between gap-6 py-5 text-meta">
      <ul className="flex items-baseline gap-2">
        {options.map((o, i) => (
          <li key={o.value} className="flex items-baseline gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted">
                /
              </span>
            )}
            <Link
              href={wallHref(o.value, sort)}
              scroll={false}
              aria-current={filter === o.value ? "page" : undefined}
              className={linkClass(filter === o.value)}
            >
              {o.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Toggle: on = newest first; off = the shop's own arrangement. */}
      <Link
        href={wallHref(filter, sort === "newest" ? "default" : "newest")}
        scroll={false}
        aria-current={sort === "newest" ? "true" : undefined}
        className={linkClass(sort === "newest")}
      >
        {t.newest}
      </Link>
    </nav>
  );
}
