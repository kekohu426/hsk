/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chinesemaster.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/dashboard/*',
    '/login',
    '/register',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://chinesemaster.com'}/sitemap-words.xml`,
      `${process.env.SITE_URL || 'https://chinesemaster.com'}/sitemap-articles.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = 0.7;
    let changefreq = 'daily';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/word/')) {
      priority = 0.95;
      changefreq = 'weekly';
    } else if (path.includes('/hsk-library/word/')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/hsk-library/level/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/articles/')) {
      priority = 0.8;
      changefreq = 'daily';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};


