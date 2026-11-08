"use client";

import Image from "next/image";
import { useState } from "react";
import type { SiteImage as SiteImageData } from "@/lib/types";

interface Props {
  image: SiteImageData;
  /** Required: describe the rendered width so the browser picks the right srcset entry. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Fill a fixed-ratio parent (object-fit: cover) instead of using the native ratio. */
  cover?: boolean;
}

/** Blurred LQIP as an SVG data URL (the same technique next/image uses). */
function blurBackground(lqip: string, width: number, height: number): string {
  const w = 320;
  const h = Math.round((w * height) / width);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='14'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%' height='100%' preserveAspectRatio='none' href='${lqip}' filter='url(#b)'/></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

/**
 * The one image component for the site:
 * - keeps the native aspect ratio (width/height from CMS metadata, no cropping)
 * - lazy-loads by default; a blurred LQIP sits underneath while loading
 * - the image fades in over it once decoded (instant under reduced motion)
 * - URLs come from the global loader (lib/image-loader.ts): Sanity CDN resizes,
 *   local files get the GitHub Pages base path
 */
export function SiteImage({ image, sizes, priority = false, className = "", cover = false }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      className={`block overflow-hidden bg-placeholder bg-cover bg-center ${cover ? "h-full w-full" : ""}`}
      style={image.lqip ? { backgroundImage: blurBackground(image.lqip, image.width, image.height) } : undefined}
    >
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        data-loaded={loaded || undefined}
        className={`img-fade block w-full ${cover ? "h-full object-cover" : "h-auto"} ${className}`}
      />
    </span>
  );
}
