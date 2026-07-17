import type { MetadataRoute } from "next";

const SITE_URL = "https://alerjenkontrol.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date();
  return [
    { url: SITE_URL, lastModified: simdi, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/kontrol`,
      lastModified: simdi,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/giris`,
      lastModified: simdi,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
