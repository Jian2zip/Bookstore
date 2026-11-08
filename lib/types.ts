/**
 * Front-end domain types. Both data sources (Sanity and the placeholder set)
 * are normalised into these shapes, so components never touch raw CMS data.
 */

export type ItemType = "book" | "goods";

/** Only two statuses exist. There is no "reserved", "coming soon" or "preview". */
export type ItemStatus = "inStock" | "sold";

export type Condition = "likeNew" | "good" | "fair" | "flawed";

export type Orientation = "portrait" | "landscape";

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny base64 data URL used as the blur placeholder. */
  lqip?: string;
  orientation?: Orientation;
}

export interface SiteVideo {
  kind: "video";
  src: string;
  poster?: SiteImage;
  alt: string;
  orientation: Orientation;
}

export type GalleryEntry = ({ kind: "image" } & SiteImage) | SiteVideo;

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: SiteImage;
}

interface ItemBase {
  id: string;
  type: ItemType;
  title: string;
  slug: string;
  sku: string;
  category: string;
  tags: string[];
  /** Price in NTD (whole dollars). */
  price: number;
  /** Books are always 1. Goods may have more; quantity UI appears only when > 1. */
  stock: number;
  status: ItemStatus;
  heroImage: SiteImage;
  gallery: GalleryEntry[];
  /** Plain-text paragraphs, 50–200 words in total. */
  description: string[];
  condition: Condition;
  conditionNotes?: string;
  seo?: Seo;
  /** ISO date; drives the "Newest" sort. */
  publishedAt: string;
  /** Shop's own arrangement on the wall (ascending). Unset items follow, newest first. */
  sortOrder?: number;
}

export interface BookItem extends ItemBase {
  type: "book";
  author: string;
  translator?: string;
  publisher: string;
  year: number;
  edition?: string;
  language: string;
  isbn?: string;
}

export interface GoodsItem extends ItemBase {
  type: "goods";
  dimensions?: string;
  material?: string;
  origin?: string;
}

export type Item = BookItem | GoodsItem;

/** Image-only tile interleaved into the product wall for rhythm. Not a link. */
export interface InterludeTile {
  id: string;
  image: SiteImage;
  /** Insert after the nth product on the wall (0-based position). */
  position: number;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  shopName: string;
  tagline: string;
  email: string;
  /** Optional fields: render nothing when absent. */
  phone?: string;
  address?: string;
  socialLinks: SocialLink[];
  footerText?: string;
  shipping: {
    method: string;
    dispatchTime?: string;
  };
  newsletterUrl?: string;
}

export interface AboutPage {
  tagline: string;
  intro: string[];
  buyingNote?: string[];
}
