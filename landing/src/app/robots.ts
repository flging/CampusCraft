import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/verify"],
    },
    sitemap: "https://campuscraft.xyz/sitemap.xml",
  };
}
