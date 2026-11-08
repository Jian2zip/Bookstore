"use client";

/**
 * Global next/image loader (static export has no image optimizer).
 * - Sanity CDN images: width/quality/format resolved by Sanity's pipeline
 *   (auto=format → AVIF/WebP), so every srcset entry is a real resize.
 * - Local files: served as-is, with the GitHub Pages base path added.
 */
import type { ImageLoaderProps } from "next/image";
import { assetUrl } from "./paths";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  // Local images ship at a single size. Returning the same URL for every
  // width means one download per file (next dev may warn that the loader
  // ignores width — expected here).
  return assetUrl(src);
}
