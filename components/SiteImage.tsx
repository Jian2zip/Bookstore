"use client";

import Image from "next/image";
import { useState } from "react";
import { isSanityImage, sanityLoader } from "@/lib/sanity-image-loader";
import type { SiteImage as SiteImageData } from "@/lib/types";

interface Props {
  image: SiteImageData;
  /** Required: describe the rendered width so the browser picks the right srcset entry. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * The one image component for the site:
 * - keeps the native aspect ratio (width/height from CMS metadata, no cropping)
 * - lazy-loads by default, with the LQIP as a blur placeholder
 * - fades in once loaded (disabled under prefers-reduced-motion, see globals.css)
 * - Sanity images are resized/encoded by Sanity's CDN; local files by next/image
 */
export function SiteImage({ image, sizes, priority = false, className = "" }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      loader={isSanityImage(image.src) ? sanityLoader : undefined}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded || undefined}
      className={`img-fade h-auto w-full bg-placeholder ${className}`}
    />
  );
}
