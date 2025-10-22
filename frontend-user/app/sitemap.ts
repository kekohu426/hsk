import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesemaster.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard/hsk-library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // HSK level pages
  const hskLevels = [1, 2, 3, 4, 5, 6];
  const hskLevelPages: MetadataRoute.Sitemap = hskLevels.map((level) => ({
    url: `${baseUrl}/dashboard/hsk-library/level/${level}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  let wordPages: MetadataRoute.Sitemap = [];
  
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      'http://localhost:3000';
    const response = await fetch(`${apiBase}/api/landing-pages`, {
      next: { revalidate: 6 * 60 * 60 }
    });

    if (response.ok) {
      const data = await response.json();
      wordPages = (data.pages as Array<{ slug: string; updatedAt?: string }>).map((page) => ({
        url: `${baseUrl}/word/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95
      }));
    }
  } catch (error) {
    console.error('Failed to fetch word slugs for sitemap:', error);
  }

  return [...staticPages, ...hskLevelPages, ...wordPages];
}

