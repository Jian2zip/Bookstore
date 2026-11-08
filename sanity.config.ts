"use client";

/**
 * Sanity Studio, embedded at /studio.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, SINGLETONS } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "jianwu",
  title: "減屋",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
