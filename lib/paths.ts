/**
 * GitHub Pages serves a project site under /<repo>/. Next adds the base path
 * to <Link> and its own assets, but not to plain URLs we build ourselves
 * (local image src, video posters, og:image). Use assetUrl() for those.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(src: string): string {
  if (!src.startsWith("/") || src.startsWith("//")) return src; // absolute URL (e.g. Sanity CDN)
  if (basePath && (src === basePath || src.startsWith(`${basePath}/`))) return src;
  return `${basePath}${src}`;
}

/** Absolute URL for metadata (og:image, canonical). */
export function absoluteUrl(path: string): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  if (/^https?:\/\//.test(path)) return path;
  // NEXT_PUBLIC_SITE_URL already includes the base path on GitHub Pages.
  const p = basePath && path.startsWith(basePath) ? path.slice(basePath.length) : path;
  return `${site}${p.startsWith("/") ? p : `/${p}`}`;
}
