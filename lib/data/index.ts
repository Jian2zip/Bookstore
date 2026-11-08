/**
 * The only module pages should import data from. Runs at build time: the site
 * is a static export (GitHub Pages), so content changes go live on the next
 * build — see the deploy workflow, which a Sanity webhook can trigger.
 *
 * Source: Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set, otherwise the
 * placeholder set.
 *
 * Visibility rule (lib/wall.ts → isListed): sold items never reach the wall,
 * filters or similar items. They are still exported as pages, so an old link
 * shows the "sold" notice instead of a 404.
 */
import { cache } from "react";
import { isSanityConfigured } from "../../sanity/env";
import type { AboutPage, InterludeTile, Item, SiteSettings } from "../types";
import { byNewest, byWallOrder, filterAndSort, isListed, type WallFilter, type WallSort } from "../wall";
import {
  placeholderAbout,
  placeholderItems,
  placeholderSettings,
  placeholderTiles,
} from "./placeholder";
import { client, mapAbout, mapItem, mapSettings, queries, type RawItem, type RawSettings } from "./sanity";

export { isListed };
export type { WallFilter, WallSort };

// ── Loaders (deduplicated per render with React cache) ──────────────────

const loadAllItems = cache(async (): Promise<Item[]> => {
  const items = isSanityConfigured
    ? (await client.fetch<RawItem[]>(queries.all)).map(mapItem)
    : placeholderItems;
  return [...items].sort(byNewest);
});

const loadListedItems = cache(async (): Promise<Item[]> =>
  (await loadAllItems()).filter(isListed).sort(byWallOrder),
);

const loadSettings = cache(async (): Promise<{ settings: SiteSettings; tiles: InterludeTile[] }> => {
  if (!isSanityConfigured) return { settings: placeholderSettings, tiles: placeholderTiles };
  return mapSettings(await client.fetch<RawSettings | null>(queries.settings), placeholderSettings);
});

// ── Public API ──────────────────────────────────────────────────────────

/** Items for the product wall, in wall order. Sold items are never included. */
export async function getListedItems(filter: WallFilter = "all", sort: WallSort = "default"): Promise<Item[]> {
  return filterAndSort(await loadListedItems(), filter, sort);
}

/** Any item by slug, sold or not. Callers must check `status`. */
export async function getItemBySlug(slug: string): Promise<Item | null> {
  return (await loadAllItems()).find((i) => i.slug === slug) ?? null;
}

/** 2–4 listed items from the same category (falls back to same type). */
export async function getSimilarItems(item: Item, limit = 4): Promise<Item[]> {
  const others = (await loadListedItems()).filter((i) => i.id !== item.id);
  const sameCategory = others.filter((i) => i.category === item.category);
  const sameType = others.filter((i) => i.type === item.type && i.category !== item.category);
  return [...sameCategory, ...sameType].slice(0, limit);
}

/** Every slug, sold included: each gets a page so old links still resolve. */
export async function getAllSlugs(): Promise<string[]> {
  return (await loadAllItems()).map((i) => i.slug);
}

/** Listed slugs only (for the sitemap). */
export async function getListedSlugs(): Promise<{ slug: string; publishedAt: string }[]> {
  return (await loadListedItems()).map(({ slug, publishedAt }) => ({ slug, publishedAt }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await loadSettings()).settings;
}

export async function getWallTiles(): Promise<InterludeTile[]> {
  return (await loadSettings()).tiles;
}

export const getAboutPage = cache(async (): Promise<AboutPage> => {
  if (!isSanityConfigured) return placeholderAbout;
  return mapAbout(await client.fetch(queries.about), placeholderAbout);
});

/** Every item regardless of status. Only for the dev styleguide. */
export async function getAllItemsForDebug(): Promise<Item[]> {
  return loadAllItems();
}
