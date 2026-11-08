export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";

/** When false, the site runs entirely on lib/data/placeholder.ts. */
export const isSanityConfigured = projectId.length > 0;
