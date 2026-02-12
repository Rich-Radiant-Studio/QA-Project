import * as Localization from 'expo-localization';
import en from './locales/en.json';
import zh from './locales/zh.json';

const translations = {
  en,
  zh,
};

class SimpleI18n {
  constructor() {
    this.locale = 'en';
    this.defaultLocale = 'en';
    this.translations = translations;
    this.initialized = false;
    
    console.log('🌐 SimpleI18n constructor called');
    
    // 自动检测系统语言
    this.detectLanguage();
    this.initialized = true;
    
    console.log('✅ SimpleI18n initialized, locale:', this.locale);
  }

  detectLanguage() {
    try {
      const locales = Localization.getLocales();
      if (!locales || locales.length === 0) {
        this.locale = this.defaultLocale;
        console.log('⚠️ No locales detected, using default:', this.defaultLocale);
        return;
      }

      const deviceLanguage = locales[0]?.languageCode || this.defaultLocale;
      
      // 规范化语言代码：提取主语言代码（如 zh-CN -> zh, en-US -> en）
      const normalizedLanguage = deviceLanguage.split('-')[0];
      
      // 检查规范化后的语言是否在支持的翻译中
      if (this.translations[normalizedLanguage]) {
        this.locale = normalizedLanguage;
        console.log('✅ Language detected:', normalizedLanguage);
      } else {
        this.locale = this.defaultLocale;
        console.log('⚠️ Language not supported, using default:', this.defaultLocale);
      }
    } catch (error) {
      console.warn('❌ Failed to detect system language:', error);
      this.locale = this.defaultLocale;
    }
  }

  t(key) {
    if (!this.initialized) {
      console.warn('⚠️ i18n.t() called before initialization for key:', key);
    }
    
    const keys = key.split('.');
    let translation = this.translations[this.locale];
    
    // 如果当前语言没有翻译，使用默认语言
    if (!translation) {
      translation = this.translations[this.defaultLocale];
    }
    
    // 遍历键路径
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        // 如果找不到，尝试使用默认语言
        let fallback = this.translations[this.defaultLocale];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object') {
            fallback = fallback[fk];
          } else {
            console.warn('⚠️ Translation not found for key:', key);
            return key; // 都找不到，返回键本身
          }
        }
        return fallback || key;
      }
    }
    
    return translation || key;
  }
}

const i18n = new SimpleI18n();

export default i18n;
