import { AppError } from '../middleware/errorHandler.js';

const REQUIRED_SECTION_COUNT = 5;
const MIN_LONGFORM_CHARS = 850;
const MIN_EXAMPLE_SENTENCES = 3;
const MIN_FAQ = 3;
const MIN_KEYWORDS = 5;
const MIN_MAIN_IMAGES = 1;

const chineseCharRegex = /[\u4e00-\u9fff]/g;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const countChineseChars = (text = '') => {
  if (!text) return 0;
  const matches = text.match(chineseCharRegex);
  return matches ? matches.length : 0;
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const assert = (condition, message) => {
  if (!condition) {
    throw new AppError(message, 400);
  }
};

export function validateLandingPageJson(content) {
  assert(content && typeof content === 'object', 'AI 返回的数据不是对象');

  const { meta, hero, longForm, exampleSentences, faq, media } = content;

  // Meta
  assert(meta && typeof meta === 'object', '缺少 meta 字段');
  assert(isNonEmptyString(meta.title), 'meta.title 不能为空');
  assert(isNonEmptyString(meta.description), 'meta.description 不能为空');
  assert(Array.isArray(meta.keywords) && meta.keywords.length >= MIN_KEYWORDS, `关键词数量不足，至少 ${MIN_KEYWORDS} 个`);

  // Hero
  assert(hero && typeof hero === 'object', '缺少 hero 字段');
  assert(isNonEmptyString(hero.h1), 'hero.h1 不能为空');

  // Long form
  assert(longForm && typeof longForm === 'object', '缺少 longForm 字段');
  const sections = ensureArray(longForm.sections);
  assert(sections.length >= REQUIRED_SECTION_COUNT, `长文分节不足，至少 ${REQUIRED_SECTION_COUNT} 节`);
  const longFormChars = sections.reduce((sum, section) => {
    assert(isNonEmptyString(section.title), 'longForm.sections[].title 不能为空');
    assert(isNonEmptyString(section.body), 'longForm.sections[].body 不能为空');
    return sum + countChineseChars(section.body);
  }, 0);
  assert(longFormChars >= MIN_LONGFORM_CHARS, `长文中文字符不足 ${MIN_LONGFORM_CHARS} 个，当前 ${longFormChars}`);

  // Example sentences
  const examples = ensureArray(exampleSentences);
  assert(examples.length >= MIN_EXAMPLE_SENTENCES, `例句不足 ${MIN_EXAMPLE_SENTENCES} 条`);
  examples.forEach((example, idx) => {
    assert(isNonEmptyString(example.cn), `例句 ${idx + 1} 的 cn 为空`);
    assert(isNonEmptyString(example.pinyin), `例句 ${idx + 1} 的 pinyin 为空`);
    assert(isNonEmptyString(example.en), `例句 ${idx + 1} 的 en 为空`);
    const image = example.image || {};
    assert(isNonEmptyString(image.alt), `例句 ${idx + 1} 缺少图片 alt`);
    assert(isNonEmptyString(image.caption), `例句 ${idx + 1} 缺少图片 caption`);
    assert(isNonEmptyString(image.prompt), `例句 ${idx + 1} 缺少图片 prompt`);
  });

  // FAQ
  const faqList = ensureArray(faq);
  assert(faqList.length >= MIN_FAQ, `FAQ 不足 ${MIN_FAQ} 条`);
  faqList.forEach((item, idx) => {
    assert(isNonEmptyString(item.question), `FAQ ${idx + 1} question 为空`);
    assert(isNonEmptyString(item.answer) && item.answer.trim().length >= 30, `FAQ ${idx + 1} answer 过短`);
  });

  // Media
  assert(media && typeof media === 'object', '缺少 media 字段');
  const mainImages = ensureArray(media.mainImages);
  assert(mainImages.length >= MIN_MAIN_IMAGES, `主图数量不足 ${MIN_MAIN_IMAGES} 张`);
  mainImages.forEach((img, idx) => {
    assert(isNonEmptyString(img.alt), `主图 ${idx + 1} 缺少 alt`);
    assert(isNonEmptyString(img.caption), `主图 ${idx + 1} 缺少 caption`);
    assert(isNonEmptyString(img.prompt), `主图 ${idx + 1} 缺少 prompt`);
  });

  return true;
}

export function computeSeoMetrics(content) {
  const longFormChars = ensureArray(content.longForm?.sections).reduce(
    (sum, section) => sum + countChineseChars(section.body || ''),
    0
  );

  const exampleCount = ensureArray(content.exampleSentences).length;
  const faqCount = ensureArray(content.faq).length;
  const keywordCount = ensureArray(content.meta?.keywords).length;
  const mainImageCount = ensureArray(content.media?.mainImages).length;

  const scoreComponents = [
    Math.min(longFormChars / 1000, 1),
    Math.min(exampleCount / 3, 1),
    Math.min(faqCount / 3, 1),
    Math.min(keywordCount / 6, 1),
    Math.min(mainImageCount / 2, 1)
  ];

  const score = Number((scoreComponents.reduce((a, b) => a + b, 0) / scoreComponents.length).toFixed(2));

  return {
    longFormChars,
    exampleCount,
    faqCount,
    keywordCount,
    mainImageCount,
    score
  };
}
