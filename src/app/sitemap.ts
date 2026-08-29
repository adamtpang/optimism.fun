import type { MetadataRoute } from "next";

const SITE_URL = "https://optimism.fun";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/methodology", "/about", "/contact", "/privacy"];

  return routes.map((route, index) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
