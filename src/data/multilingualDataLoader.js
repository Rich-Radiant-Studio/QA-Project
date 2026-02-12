/**
 * Multilingual Data Loader
 * 多语言数据加载器 - 自动翻译用户内容
 */

import { translateTextWithCache } from '../services/translationService';
import { hotListDataZh } from './hotListData';

/**
 * 翻译单个数据项
 * @param {Object} item - 数据项
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Object>} 翻译后的数据项
 */
async function translateItem(item, targetLang) {
  if (!item) return item;
  
  const translatedItem = { ...item };
  
  // 翻译标题
  if (item.title) {
    try {
      translatedItem.title = await translateTextWithCache(item.title, targetLang);
    } catch (error) {
      console.warn('Failed to translate title:', error);
      translatedItem.title = item.title; // 保持原文
    }
  }
  
  // 翻译作者名（可选，通常保持原名）
  // translatedItem.author = item.author;
  
  // 翻译标签
  if (item.tag) {
    try {
      translatedItem.tag = await translateTextWithCache(item.tag, targetLang);
    } catch (error) {
      translatedItem.tag = item.tag;
    }
  }
  
  return translatedItem;
}

/**
 * 翻译整个分类的数据
 * @param {Array} items - 数据数组
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Array>} 翻译后的数据数组
 */
async function translateCategory(items, targetLang) {
  if (!items || items.length === 0) return items;
  
  const translatedItems = await Promise.all(
    items.map(item => translateItem(item, targetLang))
  );
  
  return translatedItems;
}

/**
 * 获取多语言数据
 * @param {string} locale - 语言代码
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 翻译后的数据
 */
export async function getMultilingualData(locale = 'zh', options = {}) {
  const { useCache = true, sourceData = hotListDataZh } = options;
  
  // 如果是中文，直接返回原始数据
  if (locale === 'zh' || locale.startsWith('zh')) {
    return sourceData;
  }
  
  // 检查缓存
  const cacheKey = `hotListData_${locale}`;
  if (useCache) {
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;
  }
  
  // 翻译所有分类
  const translatedData = {};
  const categories = Object.keys(sourceData);
  
  for (const category of categories) {
    try {
      translatedData[category] = await translateCategory(
        sourceData[category],
        locale
      );
    } catch (error) {
      console.warn(`Failed to translate category ${category}:`, error);
      translatedData[category] = sourceData[category]; // 保持原文
    }
  }
  
  // 缓存翻译结果
  if (useCache) {
    await cacheData(cacheKey, translatedData);
  }
  
  return translatedData;
}

/**
 * 从缓存获取数据
 */
async function getCachedData(key) {
  try {
    // 这里可以使用 AsyncStorage 或其他缓存机制
    // const cached = await AsyncStorage.getItem(key);
    // return cached ? JSON.parse(cached) : null;
    return null; // 暂时不使用缓存
  } catch (error) {
    console.warn('Failed to get cached data:', error);
    return null;
  }
}

/**
 * 缓存数据
 */
async function cacheData(key, data) {
  try {
    // await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

/**
 * 清除缓存
 */
export async function clearDataCache() {
  try {
    // await AsyncStorage.clear();
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}
