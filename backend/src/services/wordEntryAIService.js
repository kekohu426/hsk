import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GLM-4 API配置
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

/**
 * 读取词条规则提示词模板
 */
async function loadPromptTemplate() {
  try {
    const templatePath = path.join(__dirname, '../词条规则');
    const template = await fs.readFile(templatePath, 'utf-8');
    return template;
  } catch (error) {
    console.error('[AI Service] 读取提示词模板失败:', error.message);
    throw new AppError('提示词模板文件不存在', 500);
  }
}

/**
 * 调用GLM-4 API生成词条内容
 */
async function callGLM4API(prompt, apiKey) {
  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000  // 足够生成完整词条
      }),
      timeout: 150000  // 150秒超时
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Service] GLM-4 API错误:', response.status, errorText);
      throw new Error(`GLM-4 API返回错误: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('GLM-4 API返回格式异常');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('[AI Service] 调用GLM-4失败:', error.message);
    throw error;
  }
}

/**
 * 清理和解析AI返回的JSON
 */
function parseAIResponse(rawResponse) {
  let cleaned = rawResponse.trim();

  // 移除markdown代码块标记
  cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/```\s*$/,  '');
  
  // 移除可能的前后多余文本
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // 尝试解析JSON
  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('[AI Service] JSON解析失败:', error.message);
    console.error('[AI Service] 原始内容（前500字符）:', cleaned.substring(0, 500));
    throw new Error('AI返回了无效的JSON格式');
  }
}

/**
 * 验证词条JSON的必要字段
 */
function validateWordEntryJSON(content) {
  const requiredFields = [
    'word', 'pinyin', 'pinyinWithTones', 'english', 'level',
    'partOfSpeech', 'definition', 'collocations', 'examples'
  ];

  for (const field of requiredFields) {
    if (!content[field]) {
      throw new Error(`词条JSON缺少必要字段: ${field}`);
    }
  }

  // 验证数组字段
  if (!Array.isArray(content.collocations) || content.collocations.length < 3) {
    throw new Error('collocations必须至少包含3个搭配');
  }

  if (!Array.isArray(content.examples) || content.examples.length < 3) {
    throw new Error('examples必须至少包含3个例句');
  }

  return true;
}

/**
 * 为单个词汇生成词条内容
 */
export async function generateWordEntry(wordEntryId, apiKey) {
  try {
    // 1. 获取词条信息
    const entry = await prisma.wordEntry.findUnique({
      where: { id: wordEntryId }
    });

    if (!entry) {
      throw new AppError('词条不存在', 404);
    }

    if (entry.status !== 'PENDING_IMPORT' && entry.status !== 'FAILED') {
      throw new AppError(`词条状态不允许生成，当前状态：${entry.status}`, 400);
    }

    // 2. 更新状态为生成中
    await prisma.wordEntry.update({
      where: { id: wordEntryId },
      data: {
        status: 'GENERATING',
        generateError: null
      }
    });

    console.log(`[AI Service] 开始生成词条: ${entry.word}`);

    // 3. 读取提示词模板
    let promptTemplate = await loadPromptTemplate();

    // 4. 替换词汇占位符
    const prompt = promptTemplate.replace(/\[替换为目标词汇\]/g, entry.word);

    // 5. 调用AI生成
    console.log(`[AI Service] 调用GLM-4 API...`);
    const rawResponse = await callGLM4API(prompt, apiKey);

    // 6. 解析JSON
    console.log(`[AI Service] 解析AI响应...`);
    const contentJson = parseAIResponse(rawResponse);

    // 7. 验证内容
    console.log(`[AI Service] 验证词条内容...`);
    validateWordEntryJSON(contentJson);

    // 8. 计算统计数据
    const wordCount = JSON.stringify(contentJson).length;
    const seoScore = calculateSEOScore(contentJson);

    // 9. 更新数据库
    const updated = await prisma.wordEntry.update({
      where: { id: wordEntryId },
      data: {
        contentJson: JSON.stringify(contentJson),
        status: 'GENERATED',
        aiPrompt: prompt.substring(0, 2000), // 保存前2000字符
        aiResponse: rawResponse.substring(0, 5000), // 保存前5000字符
        aiModel: 'GLM-4',
        generatedAt: new Date(),
        wordCount,
        seoScore,
        generateError: null
      }
    });

    console.log(`[AI Service] ✅ 词条生成成功: ${entry.word}`);

    return {
      success: true,
      wordEntry: updated,
      content: contentJson
    };

  } catch (error) {
    console.error(`[AI Service] ❌ 词条生成失败:`, error.message);

    // 更新失败状态
    await prisma.wordEntry.update({
      where: { id: wordEntryId },
      data: {
        status: 'FAILED',
        generateError: error.message
      }
    }).catch(e => console.error('[AI Service] 更新失败状态失败:', e.message));

    throw error;
  }
}

/**
 * 批量生成词条
 */
export async function batchGenerateWordEntries(wordEntryIds, apiKey, onProgress) {
  const results = [];
  const total = wordEntryIds.length;

  for (let i = 0; i < wordEntryIds.length; i++) {
    const id = wordEntryIds[i];
    
    try {
      console.log(`[AI Service] 生成进度: ${i + 1}/${total}`);
      
      const result = await generateWordEntry(id, apiKey);
      results.push({
        id,
        success: true,
        word: result.wordEntry.word
      });

      // 进度回调
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          currentWord: result.wordEntry.word
        });
      }

      // 避免API限流，每个词之间间隔2秒
      if (i < wordEntryIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      results.push({
        id,
        success: false,
        error: error.message
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          error: error.message
        });
      }
    }
  }

  return results;
}

/**
 * 计算SEO评分（简单版）
 */
function calculateSEOScore(content) {
  let score = 0;

  // SEO标题和描述
  if (content.seo && content.seo.title) score += 15;
  if (content.seo && content.seo.description) score += 15;
  if (content.seo && content.seo.keywords) score += 10;

  // 内容丰富度
  if (content.collocations && content.collocations.length >= 3) score += 10;
  if (content.examples && content.examples.length >= 3) score += 10;
  if (content.practiceQuestions && content.practiceQuestions.length >= 2) score += 10;
  if (content.relatedWords && content.relatedWords.length >= 5) score += 10;

  // 详细说明
  if (content.detailedExplanation) score += 10;
  if (content.culturalTips) score += 10;

  return Math.min(100, score);
}

export default {
  generateWordEntry,
  batchGenerateWordEntries
};




