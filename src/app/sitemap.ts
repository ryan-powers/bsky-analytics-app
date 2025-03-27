import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bskystats.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
} 