import type { AdminWord, ExampleSentence, LongFormSection, WordMeta } from '@/types';

const toArray = <T>(value: unknown, fallback: T[] = []): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const toObject = <T extends Record<string, unknown>>(value: unknown, fallback: T = {} as T): T => {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
};

const sanitizeText = (val: unknown): string => (typeof val === 'string' ? val.trim() : '');

const normalizeExampleSentences = (raw: unknown): ExampleSentence[] => {
  const sentences = toArray(raw);
  return sentences.map((sentence, index) => {
    const cn = sanitizeText((sentence as any)?.cn);
    const fallbackAlt = cn ? `${cn} 场景图` : `例句图片 ${index + 1}`;
    const imageInput = toObject((sentence as any)?.image);
    return {
      cn,
      pinyin: sanitizeText((sentence as any)?.pinyin),
      en: sanitizeText((sentence as any)?.en),
      usageNote: sanitizeText((sentence as any)?.usageNote),
      image: {
        alt: sanitizeText(imageInput.alt) || fallbackAlt,
        caption: sanitizeText(imageInput.caption) || fallbackAlt,
        prompt: sanitizeText(imageInput.prompt),
        url: sanitizeText(imageInput.url) || null,
        source: sanitizeText(imageInput.source) || null,
        placement: sanitizeText(imageInput.placement) || null
      }
    };
  });
};

const countChineseChars = (text: string): number => {
  const matches = text.match(/[\u4e00-\u9fff]/g);
  return matches ? matches.length : 0;
};

const computeLongFormMeta = (sections: LongFormSection[]) => {
  const totalChineseChars = sections.reduce((sum, section) => sum + countChineseChars(section.body), 0);
  return {
    sectionsCount: sections.length,
    chineseCharCount: totalChineseChars
  };
};

export const normalizeWord = (rawWord: any): AdminWord => {
  const exampleSentences = normalizeExampleSentences(rawWord.exampleSentences);
  const characterBreakdown = toObject<Record<string, any>>(rawWord.characterBreakdown, {});
  const faqs = toArray<{ question: string; answer: string }>(rawWord.faqs);
  const studyData = toObject<any>(rawWord.studyData, null);

  const relatedWordsRaw = toObject<Record<string, any>>(rawWord.relatedWords, {});

  const seoExtrasRaw = toObject<Record<string, any>>(relatedWordsRaw.seoExtras, {});
  const longFormSections = toArray<LongFormSection>(
    rawWord.longForm?.sections || seoExtrasRaw.longForm?.sections || []
  ).map((section) => ({
    title: sanitizeText(section.title),
    body: sanitizeText(section.body),
    bulletPoints: toArray<string>(section.bulletPoints).map(sanitizeText).filter(Boolean)
  }));

  const { sectionsCount, chineseCharCount } = computeLongFormMeta(longFormSections);

  const englishSummary =
    sanitizeText(rawWord.englishSummary) || sanitizeText(seoExtrasRaw.englishSummary);

  const keywords = toArray<string>(rawWord.keywords || seoExtrasRaw.keywords).map(sanitizeText).filter(Boolean);
  const relatedLinks = toArray<{ title: string; slug: string; anchorText?: string }>(
    rawWord.relatedLinks || seoExtrasRaw.relatedLinks
  ).map((link) => ({
    title: sanitizeText(link.title),
    slug: sanitizeText(link.slug),
    anchorText: sanitizeText(link.anchorText) || sanitizeText(link.title)
  }));

  const mainImages = toArray<{ alt: string; caption: string; prompt?: string; url?: string; placement?: string }>(
    rawWord.mainImages || seoExtrasRaw.mainImages
  ).map((img, index) => ({
    alt: sanitizeText(img.alt) || `词条主图 ${index + 1}`,
    caption: sanitizeText(img.caption) || `词条主图 ${index + 1}`,
    prompt: sanitizeText(img.prompt),
    url: sanitizeText(img.url) || null,
    placement: sanitizeText(img.placement) || (index === 0 ? 'cover' : 'inline')
  }));

  const exampleImageCount = exampleSentences.filter(
    (sentence) => sentence.image && sentence.image.alt && sentence.image.caption
  ).length;

  const meta: WordMeta = {
    longFormSections: sectionsCount,
    longFormChineseChars: chineseCharCount,
    hasEnglishSummary: Boolean(englishSummary && englishSummary.length >= 50),
    keywordCount: keywords.length,
    mainImageCount: mainImages.length,
    exampleSentenceCount: exampleSentences.length,
    exampleImageCoverage: exampleImageCount,
    faqCount: faqs.length
  };

  const baseWord: AdminWord = {
    id: rawWord.id,
    chinese: sanitizeText(rawWord.chinese),
    pinyin: sanitizeText(rawWord.pinyin),
    englishDefinition: sanitizeText(rawWord.englishDefinition),
    hskLevel: Number(rawWord.hskLevel) || 1,
    slug: sanitizeText(rawWord.slug),
    pinyinNumeric: sanitizeText(rawWord.pinyinNumeric),
    createdAt: rawWord.createdAt || new Date().toISOString(),
    exampleSentences,
    characterBreakdown,
    faqs,
    relatedWords: {
      synonyms: toArray(relatedWordsRaw.synonyms).map((item) => ({
        word: sanitizeText(item.word),
        pinyin: sanitizeText(item.pinyin),
        meaning: sanitizeText(item.meaning),
        note: sanitizeText(item.note),
        slug: sanitizeText(item.slug)
      })),
      antonyms: toArray(relatedWordsRaw.antonyms).map((item) => ({
        word: sanitizeText(item.word),
        pinyin: sanitizeText(item.pinyin),
        meaning: sanitizeText(item.meaning),
        slug: sanitizeText(item.slug)
      })),
      collocations: toArray(relatedWordsRaw.collocations).map((item) => ({
        word: sanitizeText(item.word),
        pinyin: sanitizeText(item.pinyin),
        meaning: sanitizeText(item.meaning),
        example: sanitizeText(item.example)
      }))
    },
    longForm: {
      sections: longFormSections
    },
    englishSummary,
    keywords,
    relatedLinks,
    mainImages,
    meta,
    studyData
  };

  return {
    ...baseWord,
    qualityIssues: summarizeWordQuality(baseWord)
  };
};

export const summarizeWordQuality = (word: AdminWord) => {
  if (Array.isArray(word.qualityIssues) && word.qualityIssues.length > 0) {
    return word.qualityIssues;
  }

  const issues: string[] = [];
  if (!word.meta) return issues;

  if (word.meta.longFormSections < 4 || word.meta.longFormChineseChars < 800) {
    issues.push('长文不足（需≥4节且≥800字）');
  }
  if (word.meta.faqCount < 3) {
    issues.push('FAQ 不足 3 条');
  }
  if (word.meta.exampleSentenceCount < 3) {
    issues.push('例句少于 3 条');
  }
  if (word.meta.exampleImageCoverage < 3) {
    issues.push('例句图片元数据缺失');
  }
  if (word.meta.mainImageCount < 1) {
    issues.push('缺少词条主图');
  }
  if (!word.meta.hasEnglishSummary) {
    issues.push('英文摘要不足 50 词');
  }
  if (word.meta.keywordCount < 5) {
    issues.push('关键词少于 5 个');
  }

  return issues;
};
