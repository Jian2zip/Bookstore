/**
 * next/image loader for Sanity CDN images: width, quality and format are
 * resolved by Sanity's image pipeline (auto=format → AVIF/WebP by Accept
 * header), so Vercel does not re-process them. Crop arrives pre-applied as a
 * `rect` param from the URL builder.
 */
import type { ImageLoaderProps } from "next/image";

export function isSanityImage(src: string): boolean {
  return src.startsWith("https://cdn.sanity.io/");
}

export function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
