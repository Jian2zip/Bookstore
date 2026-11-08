import Link from "next/link";
import { conditionLabel } from "@/lib/condition";
import { formatPrice } from "@/lib/i18n";
import type { Item } from "@/lib/types";
import { SiteImage } from "./SiteImage";

export const WALL_SIZES = "(min-width: 96rem) 25vw, (min-width: 64rem) 33vw, (min-width: 30rem) 50vw, 100vw";

/**
 * One product on the wall: the image at its native ratio, then a single line
 * of small text. Books: "書名  作者 · 品相". Goods: "品名 · 分類". Price last.
 */
export function ProductTile({ item, priority = false }: { item: Item; priority?: boolean }) {
  const detail =
    item.type === "book"
      ? `${item.author} · ${conditionLabel(item.condition)}`
      : item.category;

  return (
    <Link href={`/item/${item.slug}`} className="tile-hover block">
      <SiteImage image={item.heroImage} sizes={WALL_SIZES} priority={priority} />
      <p className="mt-2 flex items-baseline gap-3 text-meta">
        <span className="min-w-0 flex-1 truncate">
          {item.title}
          <span className="text-muted">
            {item.type === "book" ? "　" : " · "}
            {detail}
          </span>
        </span>
        <span className="tabular shrink-0 text-muted">{formatPrice(item.price)}</span>
      </p>
    </Link>
  );
}
