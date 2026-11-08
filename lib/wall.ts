/**
 * Pure listing rules, shared by the build-time data layer and the in-browser
 * wall filter. No server-only imports here.
 */
import type { Item, ItemType } from "./types";

/** Single source of truth: an item is listed only when in stock with stock > 0. */
export function isListed(item: Pick<Item, "status" | "stock">): boolean {
  return item.status === "inStock" && item.stock > 0;
}

export const byNewest = (a: Item, b: Item) => b.publishedAt.localeCompare(a.publishedAt);

/** Shop's arrangement: sortOrder ascending; unset items after, newest first. */
export const byWallOrder = (a: Item, b: Item) => {
  const ao = a.sortOrder ?? Number.POSITIVE_INFINITY;
  const bo = b.sortOrder ?? Number.POSITIVE_INFINITY;
  return ao === bo ? byNewest(a, b) : ao - bo;
};

export type WallFilter = "all" | ItemType;
/** "default" = the shop's own arrangement; "newest" = by publishedAt. */
export type WallSort = "default" | "newest";

/** `items` must already be listed and in wall order. */
export function filterAndSort(items: Item[], filter: WallFilter, sort: WallSort): Item[] {
  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  return sort === "newest" ? [...filtered].sort(byNewest) : filtered;
}

/** URL ⇄ state. `?type=books|goods` and `?sort=newest`; defaults are omitted. */
export function parseWallParams(params: { get(name: string): string | null }): {
  filter: WallFilter;
  sort: WallSort;
} {
  const type = params.get("type");
  return {
    filter: type === "books" ? "book" : type === "goods" ? "goods" : "all",
    sort: params.get("sort") === "newest" ? "newest" : "default",
  };
}

export function wallHref(filter: WallFilter, sort: WallSort): string {
  const q = new URLSearchParams();
  if (filter !== "all") q.set("type", filter === "book" ? "books" : "goods");
  if (sort === "newest") q.set("sort", "newest");
  const s = q.toString();
  return s ? `/?${s}` : "/";
}
