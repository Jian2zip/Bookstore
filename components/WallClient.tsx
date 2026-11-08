"use client";

import { useSearchParams } from "next/navigation";
import { parseWallParams } from "@/lib/wall";
import { WallView, type WallProps } from "./Wall";

/**
 * Reads ?type= / ?sort= in the browser. The static HTML carries the default
 * wall (the Suspense fallback), so the page is complete without JavaScript.
 */
export function WallClient(props: WallProps) {
  const { filter, sort } = parseWallParams(useSearchParams());
  return <WallView {...props} filter={filter} sort={sort} />;
}
