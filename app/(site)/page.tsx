import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { ProductWall } from "@/components/ProductWall";
import { parseWallParams, WallFilters } from "@/components/WallFilters";
import { getListedItems, getWallTiles, TAGS, type WallFilter, type WallSort } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "減屋｜二手書與雜貨" },
  alternates: { canonical: "/" },
};

/**
 * Home = the product wall.
 *
 * The default wall (all items, shop order) is prerendered into the static
 * shell, so the first images are in the initial HTML. Filter/sort come from
 * the URL; that part renders per request but reads cached data.
 */
export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<Wall filter="all" sort="default" />}>
      <WallFromParams searchParams={searchParams} />
    </Suspense>
  );
}

async function WallFromParams({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { filter, sort } = parseWallParams(await searchParams);
  return <Wall filter={filter} sort={sort} />;
}

async function Wall({ filter, sort }: { filter: WallFilter; sort: WallSort }) {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.items, TAGS.settings);

  const t = getDictionary();
  const [items, tiles] = await Promise.all([getListedItems(filter, sort), getWallTiles()]);

  return (
    <>
      <h1 className="sr-only">減屋——二手書與雜貨</h1>
      <WallFilters filter={filter} sort={sort} t={t.wall} />
      {/* Image-only tiles belong to the full wall, not to filtered views. */}
      <ProductWall items={items} tiles={filter === "all" ? tiles : []} emptyText={t.wall.empty} />
    </>
  );
}
