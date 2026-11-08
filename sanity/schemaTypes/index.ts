import type { SchemaTypeDefinition } from "sanity";
import { aboutPage } from "./aboutPage";
import { item } from "./item";
import { galleryImage } from "./objects/galleryImage";
import { galleryVideo } from "./objects/galleryVideo";
import { seo } from "./objects/seo";
import { siteSettings } from "./siteSettings";

export const SINGLETONS = ["siteSettings", "aboutPage"] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  item,
  siteSettings,
  aboutPage,
  galleryImage,
  galleryVideo,
  seo,
];
