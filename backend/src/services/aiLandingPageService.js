import aiService from './aiService.js';

/**
 * HSK词条落地页 JSON模板
 * 基于HKRR法则(Happiness/Knowledge/Resonance/Rhythm)
 */
const LANDING_PAGE_SCHEMA = {
  meta: {
    title: "",
    description: "",
    keywords: [],
    slug: ""
  },
  hero: {
    h1: "",
    tagline: "",
    supportingPoints: [
      { title: "", description: "" }
    ],
    cta: { text: "", href: "" }
  },
  vocabCard: {
    word: "",
    pinyin: "",
    audioHint: "",
    coreMeaning: "",
    memoryHook: "",
    usageTip: ""
  },
  longForm: {
    sections: [
      { title: "", body: "", bulletPoints: [] }
    ],
    summaryEn: ""
  },
  usageScenarios: [
    { title: "", narrative: "", callToAction: "" }
  ],
  cultureNotes: [
    { title: "", insight: "", reference: "" }
  ],
  grammarAndCollocations: {
    patterns: [
      { pattern: "", explanation: "", example: "" }
    ],
    commonMistakes: [
      { mistake: "", correction: "", tip: "" }
    ]
  },
  exampleSentences: [
    {
      cn: "",
      pinyin: "",
      en: "",
      usageNote: "",
      image: {
        alt: "",
        caption: "",
        prompt: "",
        url: "",
        placement: ""
      }
    }
  ],
  relatedWords: {
    synonyms: [
      { word: "", pinyin: "", meaning: "", note: "", slug: "" }
    ],
    antonyms: [
      { word: "", pinyin: "", meaning: "", slug: "" }
    ],
    collocations: [
      { phrase: "", pinyin: "", meaning: "", example: "" }
    ]
  },
  featureHighlights: [
    { title: "", subtitle: "", valueProof: "", emotionHook: "" }
  ],
  faq: [
    { question: "", answer: "" }
  ],
  ctaBlock: {
    headline: "",
    subhead: "",
    primary: { text: "", href: "" },
    secondary: { text: "", href: "" }
  },
  internalLinks: [
    { title: "", slug: "", anchorText: "" }
  ],
  externalLinks: [
    { title: "", url: "", description: "" }
  ],
  media: {
    mainImages: [
      { alt: "", caption: "", prompt: "", url: "", placement: "" }
    ],
    ogImagePrompt: ""
  },
  schema: {
    definedTerm: {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": "",
      "termCode": "",
      "description": "",
      "inDefinedTermSet": "",
      "url": ""
    },
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "",
      "description": "",
      "inLanguage": "zh-CN",
      "keywords": [],
      "wordCount": 0,
      "author": { "@type": "Organization", "name": "ChineseMaster" },
      "publisher": { "@type": "Organization", "name": "ChineseMaster" },
      "mainEntityOfPage": ""
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "首页", "item": "" },
        { "@type": "ListItem", "position": 2, "name": "HSK词库", "item": "" },
        { "@type": "ListItem", "position": 3, "name": "", "item": "" }
      ]
    }
  }
};

/**
 * 构建落地页生成的Prompt(系统提示)
 */
function buildSystemPrompt() {
  return `你是【SEO优化领航者 & 内容创意总监 & 资深汉语教师】，深谙HKRR法则：
- Happiness(幸福感): 内容积极、鼓舞人心
- Knowledge(知识性): 准确、系统、有深度
- Resonance(共鸣): 贴近学习者痛点与目标
- Rhythm(节奏感): 逻辑清晰、段落分明、阅读流畅

你的任务是为单个HSK词条生成完整的SEO落地页JSON,必须满足:

1. **合法JSON**
   - UTF-8编码,双引号包裹字符串
   - 属性间用逗号分隔
   - 禁止输出Markdown、注释或JSON之外的任何文字

2. **字段完整性**
   - 严格按照模板,字段名不可更改
   - 所有必填字段不能为空或null

3. **内容要求**
   - 长文(longForm.sections): ≥5节, 总计≥850汉字
   - 例句(exampleSentences): ≥3条,每条含image元数据(alt/caption/prompt/url/placement)
   - FAQ: ≥3条,每条答案≥3句话
   - 主图(media.mainImages): ≥1张
   - 关键词(meta.keywords): ≥5个
   - 内链(internalLinks): ≥2条

4. **SEO约束**
   - title: ≤60字,包含主关键词
   - description: 110-160字
   - keywords使用主关键词、长尾词、LSI词、问答式关键词
   - 关键词自然分布,密度2-3%,避免堆砌

5. **图片元数据**
   - alt必须含关键词+语境词
   - caption: 12-20字
   - prompt详细描述(场景/光线/风格)
   - url可留空字符串(后续填充)

6. **Schema.org**
   - definedTerm: 词条定义
   - article: 文章元数据
   - breadcrumb: 面包屑导航`;
}

/**
 * 构建用户提示(具体词条)
 */
function buildUserPrompt(params) {
  const {
    word,
    pinyin,
    hskLevel,
    coreMeaning,
    audience = '零基础成人学习者',
    tone = '亲和+权威',
    keywords = {}
  } = params;

  return `请为以下词条生成落地页内容:

**词条信息**
- 中文: ${word}
- 拼音: ${pinyin}
- HSK等级: ${hskLevel}
- 核心释义: ${coreMeaning}
- 目标受众: ${audience}
- 品牌语调: ${tone}

**关键词列表**
- 主关键词: ${keywords.main || word}
- 长尾词: ${keywords.longTail?.join(', ') || `${word}的意思, ${word}怎么用, ${word}例句`}
- LSI词: ${keywords.lsi?.join(', ') || `中文${word}, 汉语${word}, HSK${hskLevel}${word}`}
- 问答式: ${keywords.qa?.join(', ') || `${word}是什么意思, ${word}怎么读, ${word}怎么记`}

**要求**
1. 严格遵循以下JSON模板,字段名和嵌套结构完全一致
2. 左栏内容(longForm/usageScenarios/cultureNotes等)≥850汉字
3. 每个段落逻辑清晰,可使用Markdown格式(**粗体**、列表、引用)
4. 例句≥3条,覆盖不同语境,图片元数据完整
5. FAQ≥3条,针对学习痛点(发音、用法、常见错误等)
6. 关键词、内链建议、Schema字段必须填充
7. **禁止输出JSON之外的任何内容**

JSON模板:
${JSON.stringify(LANDING_PAGE_SCHEMA, null, 2)}`;
}

/**
 * 生成落地页内容
 */
export async function generateLandingPageContent(params) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(params);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  console.log('[AI Landing] 开始生成词条落地页:', params.word);

  // 调用AI服务
  const rawResponse = await aiService.chat(messages, {
    max_tokens: 6000,
    temperature: 0.45
  });

  console.log('[AI Landing] 原始返回片段:', rawResponse.substring(0, 500));

  // 解析JSON
  const content = aiService.parseAIResponse(rawResponse);
  
  // 验证和计算指标
  const metrics = computeSeoMetrics(content, params.word);
  
  return {
    content,
    metrics,
    prompt: systemPrompt + '\n\n' + userPrompt,
    rawResponse
  };
}

/**
 * 计算SEO指标
 */
function computeSeoMetrics(json, word) {
  const chineseChars = countChineseChars(json.longForm?.sections || []);
  const exampleCount = json.exampleSentences?.length || 0;
  const faqCount = json.faq?.length || 0;
  const keywordCount = json.meta?.keywords?.length || 0;
  const mainImageCount = json.media?.mainImages?.length || 0;

  const issues = [];
  if (chineseChars < 850) issues.push(`长文仅${chineseChars}字,需≥850字`);
  if (exampleCount < 3) issues.push(`例句仅${exampleCount}条,需≥3条`);
  if (faqCount < 3) issues.push(`FAQ仅${faqCount}条,需≥3条`);
  if (keywordCount < 5) issues.push(`关键词仅${keywordCount}个,需≥5个`);
  if (mainImageCount < 1) issues.push('缺少主图');

  // 计算综合评分(0-100)
  let score = 0;
  score += Math.min((chineseChars / 850) * 30, 30); // 长文30分
  score += Math.min((exampleCount / 3) * 20, 20); // 例句20分
  score += Math.min((faqCount / 3) * 20, 20); // FAQ20分
  score += Math.min((keywordCount / 5) * 15, 15); // 关键词15分
  score += mainImageCount >= 1 ? 15 : 0; // 主图15分

  return {
    longFormChars: chineseChars,
    exampleCount,
    faqCount,
    keywordCount,
    mainImageCount,
    issues,
    score: Math.round(score),
    isValid: issues.length === 0
  };
}

/**
 * 统计中文字符数
 */
function countChineseChars(sections) {
  let count = 0;
  for (const section of sections) {
    if (section.body) {
      count += (section.body.match(/[\u4e00-\u9fa5]/g) || []).length;
    }
  }
  return count;
}

/**
 * 验证落地页JSON
 */
export function validateLandingPageJson(json) {
  if (!json || typeof json !== 'object') {
    throw new Error('无效的JSON对象');
  }

  // 必填字段检查
  const required = {
    'meta.title': json.meta?.title,
    'meta.description': json.meta?.description,
    'meta.keywords': json.meta?.keywords,
    'hero.h1': json.hero?.h1,
    'longForm.sections': json.longForm?.sections,
    'exampleSentences': json.exampleSentences,
    'faq': json.faq
  };

  for (const [path, value] of Object.entries(required)) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error(`缺少必填字段: ${path}`);
    }
  }

  // 数量检查
  if (json.longForm.sections.length < 5) {
    throw new Error('长文段落数不足5节');
  }

  if (json.exampleSentences.length < 3) {
    throw new Error('例句数量不足3条');
  }

  if (json.faq.length < 3) {
    throw new Error('FAQ数量不足3条');
  }

  // 图片元数据检查
  for (const sentence of json.exampleSentences) {
    if (!sentence.image || !sentence.image.alt || !sentence.image.caption) {
      throw new Error('例句缺少完整的image元数据(alt/caption)');
    }
  }

  return true;
}

export default {
  generateLandingPageContent,
  validateLandingPageJson,
  computeSeoMetrics
};
