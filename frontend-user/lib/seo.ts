import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesemaster.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ChineseMaster - Learn Chinese with AI-Powered Tools',
    template: '%s | ChineseMaster',
  },
  description:
    'Master Chinese language with our comprehensive HSK vocabulary library, daily articles, spaced repetition learning system, and AI-powered text analyzer. Perfect for beginners to advanced learners.',
  keywords: [
    'learn Chinese',
    'Chinese language',
    'HSK vocabulary',
    'Chinese learning platform',
    'Mandarin Chinese',
    'Chinese study tools',
    'spaced repetition',
    'Chinese characters',
    'Chinese grammar',
    'Chinese for beginners',
  ],
  authors: [{ name: 'ChineseMaster Team' }],
  creator: 'ChineseMaster',
  publisher: 'ChineseMaster',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'ChineseMaster',
    title: 'ChineseMaster - Learn Chinese with AI-Powered Tools',
    description:
      'Master Chinese language with our comprehensive HSK vocabulary library, daily articles, and spaced repetition learning system.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ChineseMaster - Learn Chinese',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChineseMaster - Learn Chinese with AI-Powered Tools',
    description:
      'Master Chinese language with our comprehensive HSK vocabulary library, daily articles, and spaced repetition learning system.',
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@chinesemaster',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export function generateWordMetadata(word: {
  chinese: string;
  pinyin: string;
  englishDefinition: string;
  hskLevel: number;
  slug: string;
}): Metadata {
  const title = `${word.chinese} (${word.pinyin}) - HSK ${word.hskLevel}`;
  const description = `Learn ${word.chinese} meaning, pronunciation, and usage. ${word.englishDefinition}. Complete with example sentences, character breakdown, and memory tips.`;

  return {
    title,
    description,
    keywords: [
      word.chinese,
      word.pinyin,
      `HSK ${word.hskLevel}`,
      'Chinese vocabulary',
      'learn Chinese',
      'Mandarin',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/word/${word.slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/word/${word.slug}`,
    },
  };
}

export function generateArticleMetadata(article: {
  title: string;
  slug: string;
  chineseContent: string;
  difficulty: string;
}): Metadata {
  const title = `${article.title} - Chinese Reading Practice`;
  const description = `${article.chineseContent.substring(0, 150)}... Read this ${article.difficulty} level Chinese article with pinyin, translation, and vocabulary practice.`;

  return {
    title,
    description,
    keywords: [
      'Chinese reading',
      'Chinese article',
      article.difficulty,
      'learn Chinese',
      'Chinese practice',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/dashboard/articles/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/dashboard/articles/${article.slug}`,
    },
  };
}

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ChineseMaster',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Learn Chinese with AI-powered tools and comprehensive HSK vocabulary',
    sameAs: [
      'https://twitter.com/chinesemaster',
      'https://facebook.com/chinesemaster',
      'https://instagram.com/chinesemaster',
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChineseMaster',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateWordSchema(word: {
  chinese: string;
  pinyin: string;
  englishDefinition: string;
  hskLevel: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.chinese,
    description: word.englishDefinition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `HSK ${word.hskLevel}`,
      description: `Chinese proficiency level ${word.hskLevel}`,
    },
    termCode: word.pinyin,
  };
}

export function generateArticleSchema(article: {
  title: string;
  chineseContent: string;
  difficulty: string;
  slug: string;
  createdAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.chineseContent.substring(0, 200),
    articleBody: article.chineseContent,
    datePublished: article.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ChineseMaster',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ChineseMaster',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/dashboard/articles/${article.slug}`,
    },
    inLanguage: 'zh-CN',
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}



