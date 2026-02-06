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
    
    // 自动检测系统语言
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    this.locale = deviceLanguage;
  }

  t(key) {
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
