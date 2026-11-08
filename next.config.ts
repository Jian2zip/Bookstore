import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * NEXT_PUBLIC_BASE_PATH is the repository path ("/Bookstore") when served at
 * https://<user>.github.io/Bookstore/. The deploy workflow sets it from
 * actions/configure-pages; locally it is empty, so `npm run dev` serves at /.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // /item/foo/ → item/foo/index.html: works on any static host without rewrites.
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
