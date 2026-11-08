import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // AVIF first, WebP fallback (next/image negotiates via Accept header).
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
    localPatterns: [{ pathname: "/placeholder/**" }],
  },
};

export default nextConfig;
