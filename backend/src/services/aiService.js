import axios from 'axios';
import prisma from '../utils/prisma.js';

class AIService {
  constructor() {
    this.glmApiUrl = process.env.GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.glmApiKey = process.env.GLM_API_KEY;
    this.glmModel = process.env.GLM_MODEL || 'glm-4';
  }

  async chat(messages, options = {}) {
    // In test environment, always return mock response
    if (process.env.NODE_ENV === 'test') {
      return this.getMockResponse(messages);
    }

    if (!this.glmApiKey) {
      throw new Error('AI API key not configured');
    }

    try {
      const response = await axios.post(
        this.glmApiUrl,
        {
          model: options.model || this.glmModel,
          messages,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.95,
          max_tokens: options.max_tokens || 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.glmApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 120s timeout (increased for vocabulary generation)
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      // Log detailed error for debugging (not exposed to client)
      console.error('AI Service Error Details:', {
        url: this.glmApiUrl,
        model: options.model || this.glmModel,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Return user-friendly error message
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('AI 服务响应超时（120秒）。建议：1) 减少生成数量 2) 检查网络连接 3) 稍后重试');
      }
      if (error.response?.status === 401) {
        throw new Error('AI service authentication failed');
      }
      if (error.response?.status === 429) {
        throw new Error('AI service rate limit exceeded. Please try again later.');
      }
      throw new Error('AI service is temporarily unavailable');
    }
  }

  /**
   * Clean and parse JSON response from GLM-4
   * Handles markdown code blocks and malformed JSON
   */
  parseAIResponse(response) {
    const extractBalancedSegment = (text, startIndex) => {
      const opener = text[startIndex];
      const closer = opener === '{' ? '}' : ']';
      let inString = false;
      let escaped = false;
      let depth = 0;

      for (let i = startIndex; i < text.length; i++) {
        const char = text[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }
        if (inString) continue;

        if (char === opener) depth++;
        if (char === closer) {
          depth--;
          if (depth === 0) {
            return text.slice(startIndex, i + 1);
          }
        }
      }
      return text.slice(startIndex);
    };

    const findFirstJsonSegment = (text) => {
      if (!text) return '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '{' || char === '[') {
          return extractBalancedSegment(text, i);
        }
      }
      return text;
    };

    const trimTrailingText = (text) => {
      const lastBrace = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
      if (lastBrace === -1) {
        return text;
      }
      return text.slice(0, lastBrace + 1);
    };

    const tryParse = (text, label) => {
      if (!text) return null;
      const candidate = text.trim();
      if (!candidate) return null;
      console.log(`[AI Service] parsing candidate (${label}) preview:`, candidate.substring(0, 120));
      return JSON.parse(candidate);
    };

    try {
      if (!response || typeof response !== 'string') {
        throw new Error('AI响应为空');
      }

      const raw = response.trim();
      const fencedMatch =
        raw.match(/```json([\s\S]*?)```/i) ||
        raw.match(/```([\s\S]*?)```/i);

      const fencedContent = fencedMatch && fencedMatch[1] ? fencedMatch[1].trim() : null;
      const primarySource = fencedContent || raw;

      const initialSegment = findFirstJsonSegment(primarySource);

      try {
        return tryParse(initialSegment, 'balanced');
      } catch (primaryError) {
        console.log('[AI Service] 初次解析失败:', primaryError.message);

        const cleanedSegment = trimTrailingText(
          initialSegment
            .replace(/\uFEFF/g, '')
            .replace(/\u200b/g, '')
            .replace(/\r\n/g, '\n')
            .replace(/\u2028|\u2029/g, '')
        );

        try {
          return tryParse(cleanedSegment, 'cleaned');
        } catch (cleanError) {
          console.log('[AI Service] 清理后解析失败:', cleanError.message);

          if (!fencedContent) {
            const fallbackSegment = findFirstJsonSegment(raw);
            if (fallbackSegment && fallbackSegment !== initialSegment) {
              return tryParse(trimTrailingText(fallbackSegment), 'fallback');
            }
          }

          throw cleanError;
        }
      }
    } catch (error) {
      console.error('[AI Service] JSON 解析失败:', error.message);
      console.error('[AI Service] 响应长度:', response?.length);
      console.error('[AI Service] 响应开头(500字符):', response?.substring(0, 500));
      console.error('[AI Service] 响应结尾(500字符):', response?.substring(Math.max(0, response.length - 500)));

      throw new Error(`AI返回了无效的JSON格式。请重试或调整生成参数。原因：${error.message}`);
    }
  }

  sanitizeText(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  ensureObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  countChineseChars(text) {
    if (!text) return 0;
    const matches = text.match(/[\u4e00-\u9fff]/g);
    return matches ? matches.length : 0;
  }

  normalizeExampleSentence(sentence, fallbackAlt) {
    const safeSentence = sentence || {};
    const cn = this.sanitizeText(safeSentence.cn);
    const pinyin = this.sanitizeText(safeSentence.pinyin);
    const en = this.sanitizeText(safeSentence.en);
    const usageNote = this.sanitizeText(safeSentence.usageNote);

    const imageInput = this.ensureObject(safeSentence.image);
    const image = {
      alt: this.sanitizeText(imageInput.alt) || fallbackAlt,
      caption: this.sanitizeText(imageInput.caption) || cn,
      prompt: this.sanitizeText(imageInput.prompt) || `${fallbackAlt} 的插图`,
      url: this.sanitizeText(imageInput.url) || null,
      source: this.sanitizeText(imageInput.source) || null
    };

    return {
      cn,
      pinyin,
      en,
      usageNote,
      image
    };
  }

  normalizeLongForm(longFormRaw) {
    const longForm = this.ensureObject(longFormRaw);
    const sections = this.ensureArray(longForm.sections).map((section) => {
      const normalizedSection = this.ensureObject(section);
      return {
        title: this.sanitizeText(normalizedSection.title),
        body: this.sanitizeText(normalizedSection.body),
        bulletPoints: this.ensureArray(normalizedSection.bulletPoints)
          .map((point) => this.sanitizeText(point))
          .filter(Boolean),
        summary: this.sanitizeText(normalizedSection.summary)
      };
    }).filter((section) => section.title || section.body);

    const totalChineseChars = sections.reduce((sum, section) => sum + this.countChineseChars(section.body), 0);

    return {
      sections,
      totalChineseChars,
      englishSummary: this.sanitizeText(longForm.englishSummary || longForm.summaryEn || ''),
      keywords: this.ensureArray(longForm.keywords).map((item) => this.sanitizeText(item)).filter(Boolean)
    };
  }

  normalizeMainImages(imagesRaw, fallbackAlt) {
    return this.ensureArray(imagesRaw).map((img, index) => {
      const normalized = this.ensureObject(img);
      const alt = this.sanitizeText(normalized.alt) || `${fallbackAlt} 封面图${index + 1}`;
      return {
        alt,
        caption: this.sanitizeText(normalized.caption) || alt,
        prompt: this.sanitizeText(normalized.prompt) || `${fallbackAlt} 的视觉化展示`,
        url: this.sanitizeText(normalized.url) || null,
        placement: this.sanitizeText(normalized.placement) || (index === 0 ? 'cover' : 'inline'),
        source: this.sanitizeText(normalized.source) || null
      };
    });
  }

  normalizeVocabEntry(rawEntry, { fallbackChinese = '', strict = false, validationOptions = {} } = {}) {
    const entry = this.ensureObject(rawEntry);
    const chinese = this.sanitizeText(entry.chinese || fallbackChinese);
    const normalized = {
      ...entry,
      chinese,
      pinyin: this.sanitizeText(entry.pinyin),
      pinyinNumeric: this.sanitizeText(entry.pinyinNumeric),
      englishDefinition: this.sanitizeText(entry.englishDefinition),
      hskLevel: entry.hskLevel !== undefined && entry.hskLevel !== null ? Number(entry.hskLevel) : null,
      exampleSentences: this.ensureArray(entry.exampleSentences).map((sentence, index) =>
        this.normalizeExampleSentence(sentence, `${chinese} 例句 ${index + 1}`)
      ),
      characterBreakdown: Object.entries(this.ensureObject(entry.characterBreakdown)).reduce((acc, [character, info]) => {
        acc[character] = {
          pinyin: this.sanitizeText(info?.pinyin),
          meaning: this.sanitizeText(info?.meaning),
          radical: this.sanitizeText(info?.radical),
          strokes: typeof info?.strokes === 'number' ? info.strokes : Number(info?.strokes) || null,
          mnemonic: this.sanitizeText(info?.mnemonic)
        };
        return acc;
      }, {}),
      relatedWords: {
        synonyms: this.ensureArray(entry.relatedWords?.synonyms).map((item) => {
          const normalizedItem = this.ensureObject(item);
          return {
            word: this.sanitizeText(normalizedItem.word),
            pinyin: this.sanitizeText(normalizedItem.pinyin),
            meaning: this.sanitizeText(normalizedItem.meaning),
            note: this.sanitizeText(normalizedItem.note),
            slug: this.sanitizeText(normalizedItem.slug || normalizedItem.url || '')
          };
        }).filter((item) => item.word && item.pinyin),
        antonyms: this.ensureArray(entry.relatedWords?.antonyms).map((item) => {
          const normalizedItem = this.ensureObject(item);
          return {
            word: this.sanitizeText(normalizedItem.word),
            pinyin: this.sanitizeText(normalizedItem.pinyin),
            meaning: this.sanitizeText(normalizedItem.meaning),
            slug: this.sanitizeText(normalizedItem.slug || normalizedItem.url || '')
          };
        }).filter((item) => item.word && item.pinyin),
        collocations: this.ensureArray(entry.relatedWords?.collocations).map((item) => {
          const normalizedItem = this.ensureObject(item);
          return {
            word: this.sanitizeText(normalizedItem.word),
            pinyin: this.sanitizeText(normalizedItem.pinyin),
            meaning: this.sanitizeText(normalizedItem.meaning),
            example: this.sanitizeText(normalizedItem.example)
          };
        }).filter((item) => item.word && item.pinyin)
      },
      faqs: this.ensureArray(entry.faqs).map((faq) => {
        const normalizedFaq = this.ensureObject(faq);
        return {
          question: this.sanitizeText(normalizedFaq.question),
          answer: this.sanitizeText(normalizedFaq.answer)
        };
      }).filter((faq) => faq.question && faq.answer),
      longForm: this.normalizeLongForm(entry.longForm),
      englishSummary: this.sanitizeText(entry.englishSummary || entry.summaryEn || ''),
      keywords: this.ensureArray(entry.keywords).map((keyword) => this.sanitizeText(keyword)).filter(Boolean),
      relatedLinks: this.ensureArray(entry.relatedLinks).map((link) => {
        const normalizedLink = this.ensureObject(link);
        return {
          title: this.sanitizeText(normalizedLink.title),
          slug: this.sanitizeText(normalizedLink.slug || normalizedLink.url || ''),
          anchorText: this.sanitizeText(normalizedLink.anchorText || normalizedLink.title || '')
        };
      }).filter((link) => link.title && link.slug),
      mainImages: this.normalizeMainImages(entry.mainImages, chinese)
    };

    if (strict) {
      this.validateVocabEntry(normalized, validationOptions);
    }

    return normalized;
  }

  validateVocabEntry(entry, options = {}) {
    // 默认值设为false，适合快速词汇生成
    // 落地页生成时需要明确传入strict模式
    const settings = {
      requireLongForm: options.requireLongForm ?? false,
      requireExamples: options.requireExamples ?? true,
      requireFaqs: options.requireFaqs ?? false,
      requireSentenceImages: options.requireSentenceImages ?? false,
      minExamples: options.minExamples ?? 2,
      minKeywords: options.minKeywords ?? 2,
      requireMainImages: options.requireMainImages ?? false,
      requireBreakdown: options.requireBreakdown ?? false,
      requireRelatedWords: options.requireRelatedWords ?? false
    };

    if (!entry.chinese || !entry.pinyin || !entry.englishDefinition) {
      throw new Error('词条缺少基本字段（chinese/pinyin/englishDefinition）。');
    }

    if (settings.requireExamples) {
      if (!Array.isArray(entry.exampleSentences) || entry.exampleSentences.length < settings.minExamples) {
        throw new Error(`${entry.chinese} 的例句少于 ${settings.minExamples} 条。`);
      }

      if (settings.requireSentenceImages) {
        const hasMissingImageMeta = entry.exampleSentences.some((sentence) => {
          const image = sentence.image || {};
          return !image.alt || !image.caption || !image.prompt;
        });
        if (hasMissingImageMeta) {
          throw new Error(`${entry.chinese} 的例句图片元数据缺失 alt/caption/prompt。`);
        }
      }
    }

    if (settings.requireFaqs) {
      if (!Array.isArray(entry.faqs) || entry.faqs.length < 3) {
        throw new Error(`${entry.chinese} 的 FAQ 少于 3 条。`);
      }
    }

    if (settings.requireLongForm) {
      const sections = entry.longForm?.sections || [];
      const chineseChars = entry.longForm?.totalChineseChars || 0;
      if (sections.length < 3) {
        throw new Error(`${entry.chinese} 的 longForm 分节少于 3 个。`);
      }
      if (chineseChars < 200) {
        throw new Error(`${entry.chinese} 的 longForm 中文字符不足 200。当前 ${chineseChars}`);
      }
      const hasSectionTitles = sections.every((section) => section.title && section.body);
      if (!hasSectionTitles) {
        throw new Error(`${entry.chinese} 的 longForm 存在缺少标题或正文的分节。`);
      }
      if (!entry.englishSummary || entry.englishSummary.length < 50) {
        throw new Error(`${entry.chinese} 的英文摘要缺失或过短。`);
      }
    }

    if (!Array.isArray(entry.keywords) || entry.keywords.length < settings.minKeywords) {
      throw new Error(`${entry.chinese} 的关键词数量不足（至少 ${settings.minKeywords} 个）。`);
    }

    if (settings.requireMainImages && (!Array.isArray(entry.mainImages) || entry.mainImages.length === 0)) {
      throw new Error(`${entry.chinese} 缺少主图信息。`);
    }

    if (settings.requireBreakdown) {
      const breakdownCount = Object.keys(entry.characterBreakdown || {}).length;
      if (breakdownCount === 0) {
        throw new Error(`${entry.chinese} 缺少字符拆解信息。`);
      }
    }

    if (settings.requireRelatedWords) {
      const related = entry.relatedWords || {};
      if (!Array.isArray(related.synonyms) || related.synonyms.length < 2) {
        throw new Error(`${entry.chinese} 的同义词信息不足（至少 2 条）。`);
      }
      if (!Array.isArray(related.collocations) || related.collocations.length < 2) {
        throw new Error(`${entry.chinese} 的搭配信息不足（至少 2 条）。`);
      }
      if (!Array.isArray(related.antonyms) || related.antonyms.length < 1) {
        throw new Error(`${entry.chinese} 缺少反义词信息。`);
      }
    }
  }

  getMockResponse(messages) {
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    // Mock article generation
    if (userMessage.includes('Generate a complete Chinese reading article')) {
      return JSON.stringify({
        title: "春节的传统习俗",
        titleEn: "Traditional Chinese New Year Customs",
        content: [
          {
            type: "paragraph",
            cn: "春节是中国最重要的传统节日。",
            pinyin: "Chūnjié shì zhōngguó zuì zhòngyào de chuántǒng jiérì.",
            en: "Chinese New Year is the most important traditional festival in China."
          }
        ],
        excerpt: "An introduction to Chinese New Year traditions and customs",
        hskLevel: "HSK 2-3",
        newWords: [
          { word: "春节", pinyin: "chūnjié", meaning: "Chinese New Year", hsk: 3, example: "春节是中国最重要的节日。" }
        ],
        quiz: [
          { question: "春节是什么时候？", options: ["一月一日", "春天的第一天", "农历新年"], answer: 2, explanation: "春节是农历新年" }
        ]
      });
    }
    
    // Mock vocabulary generation
    if (userMessage.includes('Generate') && userMessage.includes('vocabulary words')) {
      return JSON.stringify([
        {
          chinese: "你好",
          pinyin: "nǐhǎo",
          pinyinNumeric: "ni3hao3",
          englishDefinition: "hello",
          hskLevel: 1,
          exampleSentences: [
            { cn: "你好！很高兴认识你。", pinyin: "nǐhǎo! hěn gāoxìng rènshi nǐ.", en: "Hello! Nice to meet you." }
          ],
          characterBreakdown: {},
          relatedWords: {},
          faqs: []
        }
      ]);
    }

    return JSON.stringify({ message: "Mock response" });
  }

  async generateArticle({ topic, difficulty, keywords = [], wordCount = 300 }) {
    // Map difficulty to level for existing method
    const levelMap = {
      'Beginner': 'BEGINNER',
      'Intermediate': 'INTERMEDIATE',
      'Advanced': 'ADVANCED'
    };
    const level = levelMap[difficulty] || 'BEGINNER';
    return this.generateArticleInternal({ topic, level, length: wordCount, keywords });
  }

  async generateArticleInternal({ topic, level, length = 300, keywords = [] }) {
    const levelDescriptions = {
      BEGINNER: 'HSK 1-2 vocabulary, simple grammar',
      INTERMEDIATE: 'HSK 3-4 vocabulary, moderate complexity',
      ADVANCED: 'HSK 5-6 vocabulary, complex structures'
    };

    // Ensure keywords is an array
    const keywordsArray = typeof keywords === 'string' 
      ? keywords.split(',').map(k => k.trim()).filter(Boolean)
      : (Array.isArray(keywords) ? keywords : []);

    const prompt = `You are a professional Chinese language teacher creating educational content.

Task: Generate a complete Chinese reading article for language learners.

Requirements:
- Topic: ${topic}
- Difficulty Level: ${level} (${levelDescriptions[level]})
- Length: approximately ${length} Chinese characters
${keywordsArray.length > 0 ? `- Must include these keywords: ${keywordsArray.join(', ')}` : ''}

Output a JSON object with this structure:
{
  "title": "Chinese title",
  "titleEn": "English title",
  "content": [
    {"type": "paragraph", "cn": "Chinese text", "pinyin": "pinyin with tone marks", "en": "English translation"}
  ],
  "excerpt": "Brief summary in English (50-100 chars)",
  "hskLevel": "HSK X-Y",
  "newWords": [
    {"word": "词汇", "pinyin": "cíhuì", "meaning": "vocabulary", "hsk": 3, "example": "我们今天学习新词汇。"}
  ],
  "quiz": [
    {"question": "Question in Chinese", "options": ["A", "B", "C"], "answer": 0, "explanation": "Why this is correct"}
  ]
}

Make the content natural, engaging, and culturally authentic. Include 6-10 new vocabulary words appropriate for the level. Generate 2-3 multiple choice comprehension questions.`;

    const messages = [
      { role: 'system', content: 'You are a professional Chinese language teacher. Always respond in valid JSON format.' },
      { role: 'user', content: prompt }
    ];

    const response = await this.chat(messages);
    const parsed = this.parseAIResponse(response);
    
    // Generate slug from title
    const generateSlug = (title) => {
      // Convert Chinese characters to pinyin-like representation or use simple transliteration
      // For now, use a timestamp-based approach for uniqueness
      const timestamp = Date.now().toString(36);
      const simplifiedTitle = title.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return simplifiedTitle ? `${simplifiedTitle}-${timestamp}` : `article-${timestamp}`;
    };
    
    // Calculate reading time (200 Chinese chars per minute)
    const totalChars = parsed.content.reduce((sum, p) => sum + (p.cn?.length || 0), 0);
    const readTime = Math.max(1, Math.ceil(totalChars / 200));
    
    // Calculate word count
    const wordCount = totalChars;
    
    // Return complete article structure matching articles.json
    return {
      title: parsed.title || `${topic} (Chinese Article)`,
      titleEn: parsed.titleEn || null,
      slug: generateSlug(parsed.title || topic),
      content: parsed.content, // ✅ Keep structured array
      excerpt: parsed.excerpt || `Learn Chinese through this ${level.toLowerCase()} level article about ${topic}.`,
      level, // BEGINNER, INTERMEDIATE, ADVANCED
      hskLevel: parsed.hskLevel || (level === 'BEGINNER' ? 'HSK 1-2' : level === 'INTERMEDIATE' ? 'HSK 3-4' : 'HSK 5-6'),
      readTime,
      wordCount,
      newWords: parsed.newWords || [],
      quiz: parsed.quiz || [],
      coverImage: null, // Can be added later
      audioUrl: null, // Can be added later
      metaTitle: `${parsed.title || topic} - ${parsed.hskLevel || 'HSK'} 中文阅读 | ChineseMaster`,
      metaDescription: parsed.excerpt || `通过这篇${level === 'BEGINNER' ? '初级' : level === 'INTERMEDIATE' ? '中级' : '高级'}文章学习中文。适合${parsed.hskLevel || 'HSK'}学习者。`,
      status: 'DRAFT', // Default to draft
      publishedAt: null,
      viewCount: 0
    };
  }

  async generateVocabulary({ hskLevel, prompt, count = 10 }) {
    // ===简化版词汇生成===
    // 用于快速批量生成学习词汇（非SEO落地页）
    // 只需要基本字段：中文、拼音、释义、例句、关键词
    const basePrompt = `你是一名资深汉语教师。请生成 ${count} 个 HSK ${hskLevel} 学习词汇。

要求：
- 输出纯JSON数组（无Markdown、无注释）
- 每个词汇只需基本字段：中文、拼音、释义、例句（2条即可）、关键词（2个即可）
- 例句要简洁实用
- 所有字符串必须正确转义

输出一个 JSON 数组示例：
[
  {
    "chinese": "你好",
    "pinyin": "nǐhǎo",
    "pinyinNumeric": "ni3 hao3",
    "englishDefinition": "hello; hi",
    "hskLevel": ${hskLevel},
    "keywords": ["问候", "greeting"],
    "exampleSentences": [
      {
        "cn": "你好，很高兴认识你。",
        "pinyin": "Nǐhǎo, hěn gāoxìng rènshi nǐ.",
        "en": "Hello, nice to meet you.",
        "usageNote": "礼貌问候",
        "image": {"alt": "", "caption": "", "prompt": "", "url": ""}
      },
      {
        "cn": "你好吗？",
        "pinyin": "Nǐhǎo ma?",
        "en": "How are you?",
        "usageNote": "询问近况",
        "image": {"alt": "", "caption": "", "prompt": "", "url": ""}
      }
    ]
  }
]

注意：
- 只输出JSON数组，无额外说明
- 例句要自然实用（2条即可）
- 所有字段必填，image可以留空字符串
- 不需要longForm/FAQ/mainImages等复杂字段`;

    const fullPrompt = prompt
      ? `${basePrompt}\n\n附加说明：${prompt.trim()}`
      : basePrompt;

    const messages = [
      { role: 'system', content: 'You are a Chinese language expert. Always respond in valid JSON format without any markdown formatting or additional text.' },
      { role: 'user', content: fullPrompt }
    ];

    console.log('[AI Service] 开始调用 GLM-4 生成词汇...');
    const startTime = Date.now();

    try {
      const response = await this.chat(messages, { 
        max_tokens: 8000,
        temperature: 0.45 
      });
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[AI Service] GLM-4 响应完成，耗时 ${duration} 秒`);
      console.log('[AI Service] 原始返回片段:', response.substring(0, 500));
      
      const parsed = this.parseAIResponse(response);
      
      // 验证返回的数据
      if (!Array.isArray(parsed)) {
        console.error('[AI Service] 返回的数据不是数组:', parsed);
        throw new Error('AI 返回的不是词汇数组');
      }
      
      // 验证每个词汇的必需字段
      const validWords = parsed.filter(word => {
        const hasRequired = word.chinese && word.pinyin && word.englishDefinition;
        if (!hasRequired) {
          console.warn('[AI Service] 词汇缺少必需字段:', word);
        }
        return hasRequired;
      });
      
      console.log(`[AI Service] 成功解析 ${validWords.length}/${parsed.length} 个有效词汇`);
      
      // 归一化可选模块，避免空对象/undefined
      const normalized = [];
      const rejected = [];

      validWords.forEach((word) => {
        try {
          const normalizedWord = this.normalizeVocabEntry(word, {
            fallbackChinese: word.chinese,
            strict: false  // 宽松模式，适合快速生成
          });
          normalized.push(normalizedWord);
        } catch (validationError) {
          rejected.push({
            chinese: word.chinese,
            error: validationError.message
          });
          console.warn('[AI Service] 词汇校验失败:', {
            chinese: word.chinese,
            error: validationError.message
          });
        }
      });

      if (normalized.length === 0) {
        throw new Error(`AI 生成的词汇未通过质量校验: ${rejected.map((item) => `${item.chinese || '未知'}(${item.error})`).join('; ')}`);
      }

      if (rejected.length > 0) {
        console.warn('[AI Service] 部分词条未通过验证:', rejected);
      }

      return normalized;
    } catch (error) {
      console.error('[AI Service] 词汇生成失败:', error.message);
      throw error;
    }
  }

  async generateWordStudyData({ word, hskLevel }) {
    if (!word) {
      throw new Error('word is required for study data generation');
    }
    const levelTag = `HSK${hskLevel || 1}`;

    const prompt = `提示词：
请为HSK汉语词汇“${word}”生成结构化数据，用于自动渲染词汇学习页面。所有内容需包含中文（cn）和英文（en）双语版本，具体维度如下：

一、基础信息
- 词汇本身（word）
- 拼音（pinyin，不带声调）
- 带声调拼音（pinyinWithTones，用数字1-4标注声调）
- 英文释义（english）
- HSK等级（level，如${levelTag}）
- 词性（partOfSpeech，含中、英文）
- 声调说明（tones，每个字的声调描述，分中、英文）

二、词汇详解
- 核心含义（definition，中、英文详细解释）
- 常见搭配（collocations，至少3个，每个含中文、拼音、英文）
- 考试频率（testFrequency，中、英文描述，可含星级）
- 详细说明（detailedExplanation，中、英文扩展解释）
- 易错点（confusionPoints，含错误例句、正确例句及英文解析）
- 考题类型（examTypes，至少3种，分中、英文）
- 真题例句（examples，至少3个，每个含中文、拼音、英文、考题来源）
- 文化背景（culturalTips，中、英文文化相关说明）

三、互动内容
- 练习题（practiceQuestions，至少2题，每题含中、英文问题及选项，选项需标记正确性）
- 相关词汇（relatedWords，至少5个，每个含中文、英文、链接路径）

四、资源与SEO
- 音频信息（audio，含URL、时长、格式）
- SEO配置（seo，含title、description、keywords、canonical、og标签）
- 面包屑导航（breadcrumb，各层级名称、链接，标记当前页）
- 底部引导（cta，含标题、描述、按钮文本及链接）

要求：
1. 拼音声调标注准确，符合汉语发音规范
2. 内容难度匹配对应HSK等级
3. 考题类型、例句需贴合HSK考试实际
4. 相关词汇与核心词关联紧密，等级相近
5. 链接URL格式统一（如/audio/hsk[等级]/[拼音].mp3）
6. 所有内容直接用于页面渲染，无需二次加工

请返回纯JSON格式数据，不要添加额外说明。务必将 level 字段设置为 "${levelTag}"。
`;

    const systemMessage = 'You are a senior Chinese language curriculum designer. Always respond with valid JSON only—no markdown fences, no commentary.';

    const messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ];

    const response = await this.chat(messages, {
      max_tokens: 6000,
      temperature: 0.4
    });

    return this.parseAIResponse(response);
  }

  async generateVocabPage({ word, hskLevel, modules = [] }) {
    const moduleDescriptions = {
      longForm: 'Produce a structured long-form article (5-7 sections, >=850 Chinese characters total) covering meaning, grammar, collocations, culture, memory tricks, and study advice.',
      examples: 'Create at least 3 diverse example sentences with usage notes and rich image metadata (alt, caption, prompt).',
      breakdown: 'Provide character-by-character breakdown with pinyin, meaning, radical, strokes, and mnemonic tips.',
      related: 'List 3 synonyms, 3 collocations, and 2 antonyms with short notes for each.',
      faqs: 'Write 5 SEO-friendly FAQ entries with detailed answers (min 3 sentences).',
      media: 'Propose 2 main images (cover + inline) with descriptive alt text, captions (12-20 Chinese chars), and vivid English prompts.'
    };

    const requestedModules = modules.length > 0 ? modules : ['longForm', 'examples', 'breakdown', 'related', 'faqs', 'media'];
    const moduleInstructions = requestedModules
      .map((module) => `- ${moduleDescriptions[module] || module}`)
      .join('\n');

    const prompt = `You are creating comprehensive, SEO-ready learning content for the Chinese word “${word}” (HSK ${hskLevel}).

Always produce the full JSON object below. Focus especially on这些模块:
${moduleInstructions}

Return ONLY the JSON object (no markdown, no comments) with this structure:
{
  "chinese": "${word}",
  "pinyin": "带声调的拼音",
  "pinyinNumeric": "pin1 yin1",
  "englishDefinition": "Concise and accurate meaning.",
  "hskLevel": ${hskLevel},
  "longForm": {
    "sections": [
      {"title": "Section title", "body": ">=120 Chinese characters of rich explanation.", "bulletPoints": ["可选要点…"]},
      {"title": "…", "body": "…", "bulletPoints": []}
    ],
    "keywords": ["核心关键词", "相关场景词", "拼音关键词", "英文关键词"]
  },
  "englishSummary": "50-100 words English overview mentioning meaning, usage, tone, and tips.",
  "keywords": ["至少5个关键词，覆盖中文、拼音、英文、语境词"],
  "relatedLinks": [{"title": "站内相关词条", "slug": "word-slug-or-url", "anchorText": "锚文本"}],
  "exampleSentences": [
    {
      "cn": ">=15 汉字，包含该词的自然语境例句。",
      "pinyin": "对应拼音",
      "en": "Natural English translation.",
      "usageNote": "学习备注或语境说明，可选。",
      "image": {
        "alt": "自然语言 ALT 文本，包含关键字与语境词。",
        "caption": "12-20 字中文图注。",
        "prompt": "Detailed English prompt describing scene, subject, style, lighting, etc.",
        "url": ""
      }
    },
    {"cn": "...", "pinyin": "...", "en": "...", "usageNote": "...", "image": {"alt": "...", "caption": "...", "prompt": "...", "url": ""}},
    {"cn": "...", "pinyin": "...", "en": "...", "usageNote": "...", "image": {"alt": "...", "caption": "...", "prompt": "...", "url": ""}}
  ],
  "characterBreakdown": {
    "字": {"pinyin": "zì", "meaning": "含义", "radical": "部首", "strokes": 10, "mnemonic": "记忆提示"}
  },
  "relatedWords": {
    "synonyms": [{"word": "同义词", "pinyin": "pinyin", "meaning": "meaning", "note": "差异说明"}],
    "antonyms": [{"word": "反义词", "pinyin": "pinyin", "meaning": "meaning"}],
    "collocations": [{"word": "常见搭配", "pinyin": "pinyin", "meaning": "搭配含义"}]
  },
  "faqs": [
    {"question": "常见问题1", "answer": "至少三句话，提供详尽解释、注意事项、学习建议。"},
    {"question": "常见问题2", "answer": "..."},
    {"question": "常见问题3", "answer": "..."}
  ],
  "mainImages": [
    {"alt": "主图 ALT 文本", "caption": "12-20 字中文说明", "prompt": "详细英文生成提示", "url": "", "placement": "cover"},
    {"alt": "次要图片 ALT", "caption": "12-20 字中文说明", "prompt": "英文生成提示", "url": "", "placement": "inline"}
  ]
}

严禁留空，所有文本必须自然流畅、信息准确。`;

    const messages = [
      { role: 'system', content: 'You are an expert Chinese linguist and SEO copywriter. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ];

    const response = await this.chat(messages, {
      max_tokens: 4800,
      temperature: 0.45
    });
    const parsed = this.parseAIResponse(response);
    const normalized = this.normalizeVocabEntry(parsed, {
      fallbackChinese: word,
      strict: false
    });

    const validationOptions = {
      requireLongForm: requestedModules.includes('longForm'),
      requireExamples: requestedModules.includes('examples'),
      requireFaqs: requestedModules.includes('faqs'),
      requireSentenceImages: requestedModules.includes('examples')
    };

    this.validateVocabEntry(normalized, validationOptions);
    return normalized;
  }
}

const aiService = new AIService();
export { aiService };
export default aiService;
