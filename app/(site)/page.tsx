import type { Metadata } from "next";
import { Suspense } from "react";
import { WallView } from "@/components/Wall";
import { WallClient } from "@/components/WallClient";
import { getListedItems, getWallTiles } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "減屋｜二手書與雜貨" },
  alternates: { canonical: "/" },
};

/**
 * Home = the product wall. Exported as static HTML with the default view;
 * filtering and sorting (?type=books|goods, ?sort=newest) happen client-side.
 */
export default async function Home() {
  const t = getDictionary();
  const [items, tiles] = await Promise.all([getListedItems(), getWallTiles()]);
  const props = { items, tiles, t: t.wall };

  return (
    <>
      <h1 className="sr-only">減屋——二手書與雜貨</h1>
      <Suspense fallback={<WallView {...props} filter="all" sort="default" />}>
        <WallClient {...props} />
      </Suspense>
    </>
  );
}
