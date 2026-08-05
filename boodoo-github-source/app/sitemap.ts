import type { MetadataRoute } from "next";
import { allTrackerPages } from "../lib/tracker-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://boodoo.app/",
      lastModified,
      changeFrequency: "monthly",
      priority: 1
    },
    ...allTrackerPages.map((page) => ({
      url: `https://boodoo.app/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.slug === "newborn-tracker" ? 0.9 : 0.8
    }))
  ];
}
