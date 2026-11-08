import type { InterludeTile, Item } from "@/lib/types";
import { ProductTile, WALL_SIZES } from "./ProductTile";
import { SiteImage } from "./SiteImage";

type Cell = { kind: "item"; item: Item } | { kind: "tile"; tile: InterludeTile };

/** Interleave image-only tiles after the product at `position`. */
function interleave(items: Item[], tiles: InterludeTile[]): Cell[] {
  const byPosition = new Map<number, InterludeTile[]>();
  for (const tile of tiles) {
    if (tile.position >= items.length - 1) continue; // the wall always ends on a product
    byPosition.set(tile.position, [...(byPosition.get(tile.position) ?? []), tile]);
  }
  return items.flatMap((item, i): Cell[] => [
    { kind: "item", item },
    ...(byPosition.get(i) ?? []).map((tile): Cell => ({ kind: "tile", tile })),
  ]);
}

/**
 * The continuous product wall.
 *
 * CSS Grid with native image ratios: rows are aligned to the bottom so every
 * caption in a row sits on the same line while the images above vary in
 * height. 1 column on phones, 2 from 480px (incl. tablets), 3 from 1024px,
 * 4 from 1536px.
 */
export function ProductWall({
  items,
  tiles = [],
  emptyText,
}: {
  items: Item[];
  tiles?: InterludeTile[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="py-section text-muted">{emptyText}</p>;
  }

  const cells = interleave(items, tiles);

  return (
    <ul className="grid grid-cols-1 items-end gap-x-wall gap-y-[calc(var(--spacing-wall)*2.5)] xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {cells.map((cell, i) =>
        cell.kind === "item" ? (
          <li key={cell.item.id}>
            {/* First row loads eagerly; it is the LCP candidate. */}
            <ProductTile item={cell.item} priority={i < 2} />
          </li>
        ) : (
          <li key={cell.tile.id}>
            <SiteImage image={cell.tile.image} sizes={WALL_SIZES} />
            {/* Empty caption line keeps the image aligned with its neighbours. */}
            <p className="mt-2 text-meta" aria-hidden="true">
              &nbsp;
            </p>
          </li>
        ),
      )}
    </ul>
  );
}
