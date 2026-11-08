/**
 * Sanity source: GROQ queries + mapping into the front-end types.
 * Only used when NEXT_PUBLIC_SANITY_PROJECT_ID is set.
 */
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";
import type {
  AboutPage,
  GalleryEntry,
  InterludeTile,
  Item,
  Orientation,
  SiteImage,
  SiteSettings,
} from "../types";

// A dummy id keeps module evaluation safe when Sanity isn't configured; the
// data layer never calls the client in that case.
const config = { projectId: projectId || "unconfigured", dataset };
export const client = createClient({ ...config, apiVersion, useCdn: true, perspective: "published" });
const builder = createImageUrlBuilder(config);

// ── GROQ ────────────────────────────────────────────────────────────────
const imageFields = `crop, hotspot, alt, orientation, asset->{ _id, "lqip": metadata.lqip }`;

const itemFields = `
  "id": _id, type, title, "slug": slug.current, sku, category, "tags": coalesce(tags, []),
  price, "stock": coalesce(stock, 1), status,
  heroImage{ ${imageFields} },
  "gallery": coalesce(gallery, [])[]{
    _type, ${imageFields},
    "videoUrl": file.asset->url,
    poster{ ${imageFields} }
  },
  description, condition, conditionNotes,
  seo{ title, description, ogImage{ ${imageFields} } },
  "publishedAt": coalesce(publishedAt, _createdAt), sortOrder,
  author, translator, publisher, year, edition, language, isbn,
  dimensions, material, origin
`;

/**
 * Listing queries filter sold items on the server, so they never reach the
 * wall, filters, similar items or the sitemap — even before the JS guard.
 */
export const LISTED = `_type == "item" && status == "inStock" && coalesce(stock, 1) > 0`;

export const queries = {
  listed: `*[${LISTED}] | order(coalesce(publishedAt, _createdAt) desc) { ${itemFields} }`,
  /** Every item regardless of status (debug / data check only). */
  all: `*[_type == "item"] | order(coalesce(publishedAt, _createdAt) desc) { ${itemFields} }`,
  /** Includes sold items, so old links can show the "sold" notice. */
  bySlug: `*[_type == "item" && slug.current == $slug][0] { ${itemFields} }`,
  settings: `*[_type == "siteSettings"][0]{
    shopName, tagline, email, phone, address, footerText, newsletterUrl,
    "socialLinks": coalesce(socialLinks, [])[]{ label, url },
    shipping, "wallTiles": coalesce(wallTiles, [])[]{ _key, position, image{ ${imageFields} } }
  }`,
  about: `*[_type == "aboutPage"][0]{ tagline, intro, buyingNote }`,
};

// ── Mapping ─────────────────────────────────────────────────────────────
interface RawImage {
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: unknown;
  alt?: string;
  orientation?: Orientation;
  asset?: { _id: string; lqip?: string };
}

/** Asset ids encode their dimensions: image-<hash>-<w>x<h>-<ext>. */
function assetDimensions(id: string): [number, number] {
  const m = /-(\d+)x(\d+)-/.exec(id);
  return m ? [Number(m[1]), Number(m[2])] : [1600, 2000];
}

export function mapImage(raw: RawImage | null | undefined): SiteImage | undefined {
  if (!raw?.asset?._id) return undefined;
  const [w0, h0] = assetDimensions(raw.asset._id);
  const c = raw.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const width = Math.round(w0 * (1 - c.left - c.right));
  const height = Math.round(h0 * (1 - c.top - c.bottom));
  // The builder applies the editor's crop as a `rect` param; the width,
  // quality and format params are added per request by lib/image-loader.ts.
  const src = builder.image(raw).url();
  return {
    src,
    width,
    height,
    alt: raw.alt ?? "",
    lqip: raw.asset.lqip,
    orientation: raw.orientation ?? (width >= height ? "landscape" : "portrait"),
  };
}

const paragraphs = (text?: string | null) =>
  (text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

type RawGallery = RawImage & { _type: string; videoUrl?: string; poster?: RawImage };
type RawItem = Omit<Item, "heroImage" | "gallery" | "description" | "seo"> & {
  heroImage: RawImage;
  gallery: RawGallery[];
  description?: string;
  seo?: { title?: string; description?: string; ogImage?: RawImage };
};

export function mapItem(raw: RawItem): Item {
  const gallery: GalleryEntry[] = raw.gallery.flatMap((g): GalleryEntry[] => {
    if (g._type === "galleryVideo" && g.videoUrl) {
      return [{ kind: "video", src: g.videoUrl, poster: mapImage(g.poster), alt: g.alt ?? "", orientation: g.orientation ?? "landscape" }];
    }
    const image = mapImage(g);
    return image ? [{ kind: "image", ...image }] : [];
  });
  return {
    ...raw,
    heroImage: mapImage(raw.heroImage) ?? { src: "", width: 1, height: 1, alt: raw.title },
    gallery,
    description: paragraphs(raw.description),
    seo: raw.seo ? { ...raw.seo, ogImage: mapImage(raw.seo.ogImage) } : undefined,
  } as Item;
}

type RawSettings = Omit<SiteSettings, "socialLinks"> & {
  socialLinks: SiteSettings["socialLinks"];
  wallTiles: { _key: string; position: number; image: RawImage }[];
};

export function mapSettings(raw: RawSettings | null, fallback: SiteSettings) {
  if (!raw) return { settings: fallback, tiles: [] as InterludeTile[] };
  const { wallTiles, ...rest } = raw;
  const settings: SiteSettings = {
    ...fallback,
    ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null && v !== "")),
    shipping: { ...fallback.shipping, ...(raw.shipping ?? {}) },
  };
  const tiles = wallTiles.flatMap((t) => {
    const image = mapImage(t.image);
    return image ? [{ id: t._key, position: t.position, image }] : [];
  });
  return { settings, tiles };
}

export function mapAbout(raw: { tagline?: string; intro?: string; buyingNote?: string } | null, fallback: AboutPage): AboutPage {
  if (!raw) return fallback;
  return {
    tagline: raw.tagline || fallback.tagline,
    intro: paragraphs(raw.intro),
    buyingNote: raw.buyingNote ? paragraphs(raw.buyingNote) : undefined,
  };
}

export type { RawItem, RawSettings };
