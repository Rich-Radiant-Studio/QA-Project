/**
 * Translation Service
 * 提供文本翻译功能，支持多个翻译API
 */

import * as Localization from 'expo-localization';

// 翻译API配置
const TRANSLATION_APIS = {
  // 使用 MyMemory 免费翻译API（每天1000次免费调用）
  myMemory: {
    url: 'https://api.mymemory.translated.net/get',
    free: true,
    limit: 1000, // 每天限制
  },
  // 可以添加其他API
  // googleTranslate: { ... },
  // deepL: { ... },
};

/**
 * 检测文本语言
 * @param {string} text - 要检测的文本
 * @returns {string} - 语言代码 (zh, en, etc.)
 */
export const detectLanguage = (text) => {
  // 简单的语言检测：检查是否包含中文字符
  const chineseRegex = /[\u4e00-\u9fa5]/;
  if (chineseRegex.test(text)) {
    return 'zh';
  }
  
  // 检查是否包含日文字符
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (japaneseRegex.test(text)) {
    return 'ja';
  }
  
  // 检查是否包含韩文字符
  const koreanRegex = /[\uac00-\ud7af]/;
  if (koreanRegex.test(text)) {
    return 'ko';
  }
  
  // 默认为英文
  return 'en';
};

/**
 * 获取当前系统语言
 * @returns {string} - 语言代码
 */
export const getCurrentLanguage = () => {
  const locale = Localization.locale || 'en';
  // 提取语言代码（如 'zh-CN' -> 'zh'）
  return locale.split('-')[0];
};

/**
 * 使用 MyMemory API 翻译文本
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言
 * @param {string} sourceLang - 源语言（可选）
 * @returns {Promise<object>} - 翻译结果
 */
const translateWithMyMemory = async (text, targetLang, sourceLang = 'auto') => {
  try {
    // 如果源语言是auto，自动检测
    if (sourceLang === 'auto') {
      sourceLang = detectLanguage(text);
    }
    
    // 如果源语言和目标语言相同，直接返回原文
    if (sourceLang === targetLang) {
      return {
        success: true,
        translatedText: text,
        originalText: text,
        sourceLang,
        targetLang,
        cached: false,
      };
    }
    
    // 构建API URL
    const langPair = `${sourceLang}|${targetLang}`;
    const url = `${TRANSLATION_APIS.myMemory.url}?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return {
        success: true,
        translatedText: data.responseData.translatedText,
        originalText: text,
        sourceLang,
        targetLang,
        cached: false,
      };
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: error.message,
      originalText: text,
    };
  }
};

/**
 * 翻译文本（主函数）
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言（可选，默认为系统语言）
 * @param {string} sourceLang - 源语言（可选，默认自动检测）
 * @returns {Promise<object>} - 翻译结果
 */
export const translateText = async (text, targetLang = null, sourceLang = 'auto') => {
  // 如果没有指定目标语言，使用系统语言
  if (!targetLang) {
    targetLang = getCurrentLanguage();
  }
  
  // 如果文本为空，直接返回
  if (!text || text.trim() === '') {
    return {
      success: false,
      error: 'Empty text',
      originalText: text,
    };
  }
  
  // 使用 MyMemory API 翻译
  return await translateWithMyMemory(text, targetLang, sourceLang);
};

/**
 * 批量翻译文本
 * @param {Array<string>} texts - 要翻译的文本数组
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Array<object>>} - 翻译结果数组
 */
export const translateBatch = async (texts, targetLang = null) => {
  const promises = texts.map(text => translateText(text, targetLang));
  return await Promise.all(promises);
};

/**
 * 翻译缓存管理
 */
class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // 最多缓存100条翻译
  }
  
  // 生成缓存键
  getCacheKey(text, targetLang) {
    return `${text}_${targetLang}`;
  }
  
  // 获取缓存
  get(text, targetLang) {
    const key = this.getCacheKey(text, targetLang);
    return this.cache.get(key);
  }
  
  // 设置缓存
  set(text, targetLang, translation) {
    const key = this.getCacheKey(text, targetLang);
    
    // 如果缓存已满，删除最早的一条
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, translation);
  }
  
  // 清空缓存
  clear() {
    this.cache.clear();
  }
}

// 创建全局缓存实例
export const translationCache = new TranslationCache();

/**
 * 带缓存的翻译函数
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言
 * @returns {Promise<object>} - 翻译结果
 */
export const translateTextWithCache = async (text, targetLang = null) => {
  if (!targetLang) {
    targetLang = getCurrentLanguage();
  }
  
  // 检查缓存
  const cached = translationCache.get(text, targetLang);
  if (cached) {
    return {
      ...cached,
      cached: true,
    };
  }
  
  // 翻译
  const result = await translateText(text, targetLang);
  
  // 如果翻译成功，存入缓存
  if (result.success) {
    translationCache.set(text, targetLang, result);
  }
  
  return result;
};

export default {
  translateText,
  translateTextWithCache,
  translateBatch,
  detectLanguage,
  getCurrentLanguage,
  translationCache,
};
