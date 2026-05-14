import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ─── Image Optimization ─── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // GitHub / Google avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  /* ─── Performance ─── */
  compress: true,
  poweredByHeader: false,

  /* ─── Strict React (catch bugs early) ─── */
  reactStrictMode: true,

  /* ─── Experimental ─── */
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

