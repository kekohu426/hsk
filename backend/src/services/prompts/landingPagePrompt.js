const LANDING_PAGE_SCHEMA = {
  meta: {
    title: '',
    description: '',
    keywords: [],
    slug: ''
  },
  hero: {
    h1: '',
    tagline: '',
    supportingPoints: [
      {
        title: '',
        description: ''
      }
    ],
    cta: {
      text: '',
      href: ''
    }
  },
  vocabCard: {
    word: '',
    pinyin: '',
    audioHint: '',
    coreMeaning: '',
    memoryHook: '',
    usageTip: ''
  },
  longForm: {
    sections: [
      {
        title: '',
        body: '',
        bulletPoints: []
      }
    ],
    summaryEn: ''
  },
  usageScenarios: [
    {
      title: '',
      narrative: '',
      callToAction: ''
    }
  ],
  cultureNotes: [
    {
      title: '',
      insight: '',
      reference: ''
    }
  ],
  grammarAndCollocations: {
    patterns: [
      {
        pattern: '',
        explanation: '',
        example: ''
      }
    ],
    commonMistakes: [
      {
        mistake: '',
        correction: '',
        tip: ''
      }
    ]
  },
  exampleSentences: [
    {
      cn: '',
      pinyin: '',
      en: '',
      usageNote: '',
      image: {
        alt: '',
        caption: '',
        prompt: '',
        url: '',
        placement: ''
      }
    }
  ],
  relatedWords: {
    synonyms: [
      { word: '', pinyin: '', meaning: '', note: '', slug: '' }
    ],
    antonyms: [
      { word: '', pinyin: '', meaning: '', slug: '' }
    ],
    collocations: [
      { phrase: '', pinyin: '', meaning: '', example: '' }
    ]
  },
  featureHighlights: [
    {
      title: '',
      subtitle: '',
      valueProof: '',
      emotionHook: ''
    }
  ],
  faq: [
    {
      question: '',
      answer: ''
    }
  ],
  ctaBlock: {
    headline: '',
    subhead: '',
    primary: { text: '', href: '' },
    secondary: { text: '', href: '' }
  },
  internalLinks: [
    { title: '', slug: '', anchorText: '' }
  ],
  externalLinks: [
    { title: '', url: '', description: '' }
  ],
  media: {
    mainImages: [
      { alt: '', caption: '', prompt: '', url: '', placement: '' }
    ],
    ogImagePrompt: ''
  },
  schema: {
    definedTerm: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: '',
      termCode: '',
      description: '',
      inDefinedTermSet: '',
      url: ''
    },
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '',
      description: '',
      inLanguage: 'zh-CN',
      keywords: [],
      wordCount: 0,
      author: { '@type': 'Organization', name: 'ChineseMaster' },
      publisher: { '@type': 'Organization', name: 'ChineseMaster' },
      mainEntityOfPage: ''
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '' },
        { '@type': 'ListItem', position: 2, name: 'HSK Library', item: '' },
        { '@type': 'ListItem', position: 3, name: '', item: '' }
      ]
    }
  }
};

export function buildLandingPagePrompt({
  word,
  pinyin,
  hskLevel,
  coreMeaning,
  audience,
  tone,
  keywords
}) {
  const keywordSection = `
- 主关键词：${keywords.main?.join('、') || ''}
- 长尾关键词：${keywords.longTail?.join('、') || ''}
- LSI 关键词：${keywords.lsi?.join('、') || ''}
- 问答式关键词：${keywords.qa?.join('、') || ''}
  `.trim();

  return `
你是【SEO 优化领航者 & 内容创意总监 & 资深汉语教师】。运用 HKRR 法则，为指定的 HSK 词条生成高质量的落地页 JSON。

要求：
1. 输出合法 JSON，字段名、嵌套结构与模板完全一致，禁止多余键、注释或 Markdown。
2. 中文正文总计不少于 850 汉字，例句 ≥ 3 条且附图片元数据（alt/caption/prompt/url/placement），FAQ ≥ 3 条且答案 ≥ 3 句。
3. 图片字段仅包含 alt、caption、prompt、url、placement；url 若暂无可留空字符串。
4. 各模块中自然分布关键词，避免堆砌；保持“${tone}”语调，兼顾专业性与亲和度。

词条信息：
- 中文：${word}
- 拼音：${pinyin}
- HSK 等级：${hskLevel}
- 核心释义：${coreMeaning}
- 目标受众：${audience}
- 关键词： 
${keywordSection}

JSON 模板（仅替换内容，不要新增或删减字段）：
${JSON.stringify(LANDING_PAGE_SCHEMA, null, 2)}
  `.trim();
}

export function buildLandingPageMessages(prompt) {
  return [
    {
      role: 'system',
      content:
        '你是“SEO优化领航者 & 内容创意总监 & 资深汉语教师”。必须严格输出合法 JSON，字段名与模板一致，不得返回 Markdown 或任何说明文字。'
    },
    { role: 'user', content: prompt }
  ];
}
