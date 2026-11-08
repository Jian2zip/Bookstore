/**
 * The only module pages should import data from.
 *
 * Source: Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set, otherwise the
 * placeholder set. Every function is cached (Cache Components) and tagged so a
 * Sanity webhook can revalidate on publish — e.g. marking an item "sold"
 * removes it from every listing on the next request.
 *
 * Visibility rule (single source of truth): an item is listed only when
 * status === "inStock" and stock > 0. Sold items are reachable *only* through
 * getItemBySlug, so an old link can render the "sold" notice.
 */
import { cacheLife, cacheTag } from "next/cache";
import { isSanityConfigured } from "../../sanity/env";
import type { AboutPage, InterludeTile, Item, ItemType, SiteSettings } from "../types";
import {
  placeholderAbout,
  placeholderItems,
  placeholderSettings,
  placeholderTiles,
} from "./placeholder";
import { client, mapAbout, mapItem, mapSettings, queries, type RawItem, type RawSettings } from "./sanity";

export const TAGS = { items: "items", settings: "settings", about: "about" } as const;

export function isListed(item: Pick<Item, "status" | "stock">): boolean {
  return item.status === "inStock" && item.stock > 0;
}

const byNewest = (a: Item, b: Item) => b.publishedAt.localeCompare(a.publishedAt);

// ── Raw loaders ─────────────────────────────────────────────────────────

async function loadListedItems(): Promise<Item[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.items);
  const items = isSanityConfigured
    ? (await client.fetch<RawItem[]>(queries.listed)).map(mapItem)
    : placeholderItems;
  // JS guard on top of the GROQ filter, so the rule holds for both sources.
  return items.filter(isListed).sort(byNewest);
}

// ── Public API ──────────────────────────────────────────────────────────

export type WallFilter = "all" | ItemType;
export type WallSort = "newest";

/** Items for the product wall. Sold items are never included. */
export async function getListedItems(filter: WallFilter = "all"): Promise<Item[]> {
  const items = await loadListedItems();
  return filter === "all" ? items : items.filter((i) => i.type === filter);
}

/** Any item by slug, sold or not. Callers must check `status`. */
export async function getItemBySlug(slug: string): Promise<Item | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.items, `item:${slug}`);
  if (isSanityConfigured) {
    const raw = await client.fetch<RawItem | null>(queries.bySlug, { slug });
    return raw ? mapItem(raw) : null;
  }
  return placeholderItems.find((i) => i.slug === slug) ?? null;
}

/** 2–4 listed items from the same category (falls back to same type). */
export async function getSimilarItems(item: Item, limit = 4): Promise<Item[]> {
  const others = (await loadListedItems()).filter((i) => i.id !== item.id);
  const sameCategory = others.filter((i) => i.category === item.category);
  const sameType = others.filter((i) => i.type === item.type && i.category !== item.category);
  return [...sameCategory, ...sameType].slice(0, limit);
}

/** Slugs for generateStaticParams and the sitemap. Listed items only. */
export async function getListedSlugs(): Promise<{ slug: string; publishedAt: string }[]> {
  return (await loadListedItems()).map(({ slug, publishedAt }) => ({ slug, publishedAt }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await loadSettings()).settings;
}

export async function getWallTiles(): Promise<InterludeTile[]> {
  return (await loadSettings()).tiles;
}

async function loadSettings(): Promise<{ settings: SiteSettings; tiles: InterludeTile[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);
  if (!isSanityConfigured) return { settings: placeholderSettings, tiles: placeholderTiles };
  return mapSettings(await client.fetch<RawSettings | null>(queries.settings), placeholderSettings);
}

export async function getAboutPage(): Promise<AboutPage> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.about);
  if (!isSanityConfigured) return placeholderAbout;
  return mapAbout(await client.fetch(queries.about), placeholderAbout);
}

/** Every item regardless of status. Only for the stage-1 data check page. */
export async function getAllItemsForDebug(): Promise<Item[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.items);
  if (!isSanityConfigured) return [...placeholderItems].sort(byNewest);
  return (await client.fetch<RawItem[]>(queries.all)).map(mapItem);
}
