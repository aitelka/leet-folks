import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All imagery is local (app icons, screenshots, client logos under /public).
    formats: ["image/avif", "image/webp"],
  },
  // The policies used to be hand-written static HTML at /<app>/privacy, and
  // those are the URLs registered on the Google Play listings. They are now
  // App Router pages under /privacy, so the old addresses redirect. Keep these
  // for as long as any published build points at them — redirects are checked
  // before the filesystem, so nothing under /public can shadow them.
  async redirects() {
    return [
      {
        source: "/maklafit/privacy",
        destination: "/privacy/maklafit",
        permanent: true,
      },
      {
        source: "/nokhba/privacy",
        destination: "/privacy/nokhba",
        permanent: true,
      },
      {
        source: "/rokhsati/privacy",
        destination: "/privacy/rokhsati",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
