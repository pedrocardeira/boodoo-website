import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/family", "/api/"]
    },
    sitemap: "https://www.boodoo.app/sitemap.xml"
  };
}
