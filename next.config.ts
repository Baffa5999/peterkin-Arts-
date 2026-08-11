import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF first — the artwork IS the payload on this site, and AVIF
       typically lands 30–50% smaller than WebP at equal quality.
       Next falls back to WebP, then the original JPEG, automatically. */
    formats: ["image/avif", "image/webp"],
    /* Photographs are immutable; a replaced work gets a new filename. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
