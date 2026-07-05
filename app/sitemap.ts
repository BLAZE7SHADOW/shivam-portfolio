import type { MetadataRoute } from "next";

const BASE_URL = "https://www.shivamgovindrao.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/projects`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/projects/motionstudio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/journey`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/now`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
  ];
}
