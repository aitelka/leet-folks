import type { MetadataRoute } from "next";
import { allPolicies } from "@/lib/policies";

const BASE = "https://leetfolks.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/contact`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    ...allPolicies.map((policy) => ({
      url: `${BASE}${policy.href}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
