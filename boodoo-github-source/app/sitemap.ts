import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://boodoo.app",
      lastModified: new Date("2026-07-23"),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
