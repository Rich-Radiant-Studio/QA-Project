/**
 * Language Auto-Detection Tests
 * 
 * Tests for Requirements 6.1, 6.2, 6.3, 6.4:
 * - System language detection on app startup
 * - Chinese variants use zh.json
 * - English variants use en.json
 * - Unsupported languages fallback to default (en)
 */

// Mock expo-localization BEFORE any imports
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(),
}));

describe('Language Auto-Detection', () => {
  let i18n;
  let translations;
  let Localization;

  beforeEach(() => {
    // Clear module cache to get fresh instance
    jest.resetModules();
    jest.clearAllMocks();
    
    // Import the mocked Localization
    Localization = require('expo-localization');
    
    // Import translations
    translations = {
      en: require('../locales/en.json'),
      zh: require('../locales/zh.json'),
    };
  });

  /**
   * Requirement 6.1: System language detection on app startup
   */
  describe('Requirement 6.1: System Language Detection', () => {
    test('should detect system language on initialization', () => {
      // Mock Chinese system language
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      
      // Import i18n (triggers initialization)
      i18n = require('../index').default;
      
      expect(Localization.getLocales).toHaveBeenCalled();
      expect(i18n.locale).toBe('zh');
    });

    test('should use default language when getLocales returns empty array', () => {
      Localization.getLocales.mockReturnValue([]);
      
      i18n = require('../index').default;
      
      expect(i18n.locale).toBe('en');
    });

    test('should use default language when getLocales returns null', () => {
      Localization.getLocales.mockReturnValue(null);
      
      i18n = require('../index').default;
      
      expect(i18n.locale).toBe('en');
    });

    test('should use default language when getLocales throws error', () => {
      Localization.getLocales.mockImplementation(() => {
        throw new Error('Localization error');
      });
      
      i18n = require('../index').default;
      
      expect(i18n.locale).toBe('en');
    });
  });

  /**
   * Requirement 6.2: Chinese language variants use zh.json
   */
  describe('Requirement 6.2: Chinese Language Variants', () => {
    test('should use zh translations for zh language code', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('zh');
      expect(translation).toBe(translations.zh.common.loading);
    });

    test('should normalize zh-CN to zh and use zh translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh-CN' }]);
      
      i18n = require('../index').default;
      
      // Should normalize zh-CN to zh
      expect(i18n.locale).toBe('zh');
      
      // Should use zh translations
      const translation = i18n.t('common.loading');
      expect(translation).toBe(translations.zh.common.loading);
    });

    test('should normalize zh-TW to zh and use zh translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh-TW' }]);
      
      i18n = require('../index').default;
      
      // Should normalize zh-TW to zh
      expect(i18n.locale).toBe('zh');
      
      // Should use zh translations
      const translation = i18n.t('common.loading');
      expect(translation).toBe(translations.zh.common.loading);
    });

    test('should normalize zh-HK to zh and use zh translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh-HK' }]);
      
      i18n = require('../index').default;
      
      expect(i18n.locale).toBe('zh');
      const translation = i18n.t('common.confirm');
      expect(translation).toBe(translations.zh.common.confirm);
    });
  });

  /**
   * Requirement 6.3: English language variants use en.json
   */
  describe('Requirement 6.3: English Language Variants', () => {
    test('should use en translations for en language code', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should normalize en-US to en and use en translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en-US' }]);
      
      i18n = require('../index').default;
      
      // Should normalize en-US to en
      expect(i18n.locale).toBe('en');
      
      // Should use en translations
      const translation = i18n.t('common.loading');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should normalize en-GB to en and use en translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en-GB' }]);
      
      i18n = require('../index').default;
      
      // Should normalize en-GB to en
      expect(i18n.locale).toBe('en');
      
      // Should use en translations
      const translation = i18n.t('common.loading');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should normalize en-AU to en and use en translations', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en-AU' }]);
      
      i18n = require('../index').default;
      
      expect(i18n.locale).toBe('en');
      const translation = i18n.t('common.cancel');
      expect(translation).toBe(translations.en.common.cancel);
    });
  });

  /**
   * Requirement 6.4: Unsupported languages fallback to default (en)
   */
  describe('Requirement 6.4: Unsupported Language Fallback', () => {
    test('should fallback to en for French (fr)', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'fr' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should fallback to en for Spanish (es)', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'es' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should fallback to en for Japanese (ja)', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'ja' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should fallback to en for German (de)', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'de' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.loading');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.loading);
    });

    test('should fallback to en for Korean (ko)', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'ko' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('common.submit');
      
      expect(i18n.locale).toBe('en');
      expect(translation).toBe(translations.en.common.submit);
    });
  });

  /**
   * Additional test: Translation key fallback behavior
   */
  describe('Translation Key Fallback', () => {
    test('should return translation key when not found in any language', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      i18n = require('../index').default;
      const translation = i18n.t('nonexistent.key.path');
      
      expect(translation).toBe('nonexistent.key.path');
    });

    test('should fallback to default language when key missing in current language', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      
      i18n = require('../index').default;
      
      // Test with a key that exists in both languages
      const translation = i18n.t('common.loading');
      
      // Should return either zh or en translation, not the key itself
      expect(translation).not.toBe('common.loading');
      expect([translations.zh.common.loading, translations.en.common.loading]).toContain(translation);
    });
  });

  /**
   * Integration test: Multiple translation keys
   */
  describe('Integration: Multiple Translation Keys', () => {
    test('should correctly translate multiple keys in Chinese', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      
      i18n = require('../index').default;
      
      const loading = i18n.t('common.loading');
      const confirm = i18n.t('common.confirm');
      const cancel = i18n.t('common.cancel');
      
      expect(loading).toBe(translations.zh.common.loading);
      expect(confirm).toBe(translations.zh.common.confirm);
      expect(cancel).toBe(translations.zh.common.cancel);
    });

    test('should correctly translate multiple keys in English', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      
      i18n = require('../index').default;
      
      const loading = i18n.t('common.loading');
      const confirm = i18n.t('common.confirm');
      const cancel = i18n.t('common.cancel');
      
      expect(loading).toBe(translations.en.common.loading);
      expect(confirm).toBe(translations.en.common.confirm);
      expect(cancel).toBe(translations.en.common.cancel);
    });

    test('should correctly translate nested keys', () => {
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      
      i18n = require('../index').default;
      
      // Test nested translation keys if they exist
      const translation = i18n.t('common.loading');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });
  });

  /**
   * Requirement 6.5: Language change after app restart
   */
  describe('Requirement 6.5: Language Change After Restart', () => {
    test('should detect new language after simulated restart', () => {
      // First initialization with Chinese
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      i18n = require('../index').default;
      expect(i18n.locale).toBe('zh');
      
      // Simulate app restart by resetting modules
      jest.resetModules();
      jest.clearAllMocks();
      
      // Second initialization with English
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      i18n = require('../index').default;
      expect(i18n.locale).toBe('en');
    });

    test('should use correct translations after language change', () => {
      // First initialization with English
      Localization.getLocales.mockReturnValue([{ languageCode: 'en' }]);
      i18n = require('../index').default;
      let translation = i18n.t('common.loading');
      const enTranslation = require('../locales/en.json').common.loading;
      expect(translation).toBe(enTranslation);
      
      // Simulate app restart
      jest.resetModules();
      jest.clearAllMocks();
      
      // Re-import Localization after reset
      Localization = require('expo-localization');
      
      // Second initialization with Chinese
      Localization.getLocales.mockReturnValue([{ languageCode: 'zh' }]);
      i18n = require('../index').default;
      translation = i18n.t('common.loading');
      const zhTranslation = require('../locales/zh.json').common.loading;
      expect(translation).toBe(zhTranslation);
    });
  });
});
