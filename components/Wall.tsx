import type { Dictionary } from "@/lib/i18n";
import type { InterludeTile, Item } from "@/lib/types";
import { filterAndSort, type WallFilter, type WallSort } from "@/lib/wall";
import { ProductWall } from "./ProductWall";
import { WallFilters } from "./WallFilters";

export interface WallProps {
  /** Listed items in wall order. */
  items: Item[];
  tiles: InterludeTile[];
  t: Dictionary["wall"];
}

/** Filter row + wall for a given filter/sort. Renders on the server or client. */
export function WallView({ items, tiles, t, filter, sort }: WallProps & { filter: WallFilter; sort: WallSort }) {
  return (
    <>
      <WallFilters filter={filter} sort={sort} t={t} />
      {/* Image-only tiles belong to the full wall, not to filtered views. */}
      <ProductWall items={filterAndSort(items, filter, sort)} tiles={filter === "all" ? tiles : []} emptyText={t.empty} />
    </>
  );
}
