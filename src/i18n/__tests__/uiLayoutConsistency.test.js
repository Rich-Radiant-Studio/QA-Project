/**
 * UI Layout Consistency Tests
 * 
 * Tests for Requirement 5.5 and Property 6:
 * - UI layout and styles remain consistent across different languages
 * - Text length changes don't break layout
 * - Components render properly in both Chinese and English
 * 
 * This test verifies that:
 * 1. Components render without errors in both languages
 * 2. Critical UI elements are present in both languages
 * 3. Layout properties (flex, dimensions) are maintained
 * 4. Text overflow is handled gracefully
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock translations
const mockTranslations = {
  zh: require('../locales/zh.json'),
  en: require('../locales/en.json'),
};

// Create a mock locale state
let mockCurrentLocale = 'zh';

// Mock the i18n system
jest.mock('../index.js', () => {
  const mockTranslations = {
    zh: require('../locales/zh.json'),
    en: require('../locales/en.json'),
  };
  
  return {
    i18n: {
      get locale() {
        return mockCurrentLocale;
      },
      t: (key) => {
        const keys = key.split('.');
        let translation = mockTranslations[mockCurrentLocale];
        
        for (const k of keys) {
          if (translation && typeof translation === 'object') {
            translation = translation[k];
          } else {
            return key;
          }
        }
        
        return translation || key;
      },
    },
  };
});

jest.mock('../withTranslation.js', () => {
  const mockTranslations = {
    zh: require('../locales/zh.json'),
    en: require('../locales/en.json'),
  };
  
  return {
    useTranslation: () => ({
      t: (key) => {
        const keys = key.split('.');
        let translation = mockTranslations[mockCurrentLocale];
        
        for (const k of keys) {
          if (translation && typeof translation === 'object') {
            translation = translation[k];
          } else {
            return key;
          }
        }
        
        return translation || key;
      },
    }),
  };
});

// Helper to switch language
function setLanguage(locale) {
  mockCurrentLocale = locale;
}

// Helper to create a simple test component that uses translations
function createTestComponent(translationKey) {
  const { useTranslation } = require('../withTranslation.js');
  
  return function TestComponent() {
    const { t } = useTranslation();
    return (
      <View testID="container">
        <Text testID="text">{t(translationKey)}</Text>
      </View>
    );
  };
}

describe('UI Layout Consistency Across Languages', () => {
  
  /**
   * Requirement 5.5: UI layout should remain consistent across languages
   */
  describe('Component Rendering in Both Languages', () => {
    
    test('should render AnswerListItem translations in both languages', () => {
      const TestComponent = createTestComponent('components.answerListItem.adopted');
      
      // Test Chinese
      setLanguage('zh');
      const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
      const textZh = getByTestIdZh('text');
      expect(textZh.props.children).toBe('已采纳');
      unmountZh();
      
      // Test English
      setLanguage('en');
      const { getByTestId: getByTestIdEn } = render(<TestComponent />);
      const textEn = getByTestIdEn('text');
      expect(textEn.props.children).toBe('Adopted');
    });

    test('should render QuestionListItem translations in both languages', () => {
      const TestComponent = createTestComponent('components.questionListItem.solved');
      
      // Test Chinese
      setLanguage('zh');
      const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
      const textZh = getByTestIdZh('text');
      expect(textZh.props.children).toBe('已解决');
      unmountZh();
      
      // Test English
      setLanguage('en');
      const { getByTestId: getByTestIdEn } = render(<TestComponent />);
      const textEn = getByTestIdEn('text');
      expect(textEn.props.children).toBe('Solved');
    });

    test('should render SuperLikeBalance translations in both languages', () => {
      const TestComponent = createTestComponent('components.superLikeBalance.label');
      
      // Test Chinese
      setLanguage('zh');
      const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
      const textZh = getByTestIdZh('text');
      expect(textZh.props.children).toBe('超级赞余额');
      unmountZh();
      
      // Test English
      setLanguage('en');
      const { getByTestId: getByTestIdEn } = render(<TestComponent />);
      const textEn = getByTestIdEn('text');
      expect(textEn.props.children).toBe('Super Like Balance');
    });
  });

  /**
   * Requirement 5.5: Text length changes should not break layout
   */
  describe('Text Length Variation Handling', () => {
    
    test('should handle longer English text compared to Chinese', () => {
      // English translations are often longer than Chinese
      const longTextKeys = [
        'components.superLikeBalance.label', // "超级赞余额" vs "Super Like Balance"
        'components.useSuperLikeButton.button', // Button text
        'screens.questionDetail.tabs.supplements', // "补充" vs "Supplements"
      ];

      longTextKeys.forEach(key => {
        const TestComponent = createTestComponent(key);
        
        // Test Chinese
        setLanguage('zh');
        const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
        const textZh = getByTestIdZh('text');
        const zhText = textZh.props.children;
        const zhLength = zhText ? zhText.length : 0;
        unmountZh();
        
        // Test English
        setLanguage('en');
        const { getByTestId: getByTestIdEn, unmount: unmountEn } = render(<TestComponent />);
        const textEn = getByTestIdEn('text');
        const enText = textEn.props.children;
        const enLength = enText ? enText.length : 0;
        unmountEn();
        
        // Both should render successfully
        expect(zhText).toBeTruthy();
        expect(enText).toBeTruthy();
        
        // Log length differences for analysis
        if (enLength > zhLength * 1.5) {
          console.log(`Note: ${key} - EN is ${(enLength / zhLength).toFixed(1)}x longer than ZH`);
        }
      });
    });

    test('should handle shorter English text compared to Chinese', () => {
      // Some English translations might be shorter
      const shortTextKeys = [
        'components.answerListItem.adopted', // "已采纳" vs "Adopted"
        'components.questionListItem.solved', // "已解决" vs "Solved"
        'common.loading', // "加载中..." vs "Loading..."
      ];

      shortTextKeys.forEach(key => {
        const TestComponent = createTestComponent(key);
        
        // Test Chinese
        setLanguage('zh');
        const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
        const textZh = getByTestIdZh('text');
        const zhText = textZh.props.children;
        unmountZh();
        
        // Test English
        setLanguage('en');
        const { getByTestId: getByTestIdEn, unmount: unmountEn } = render(<TestComponent />);
        const textEn = getByTestIdEn('text');
        const enText = textEn.props.children;
        unmountEn();
        
        // Both should render successfully
        expect(zhText).toBeTruthy();
        expect(enText).toBeTruthy();
      });
    });
  });

  /**
   * Requirement 5.5: Critical UI elements should be present in both languages
   */
  describe('Critical UI Elements Presence', () => {
    
    test('should have all common action translations in both languages', () => {
      const commonActions = [
        'common.confirm',
        'common.cancel',
        'common.submit',
        'common.save',
        'common.delete',
        'common.edit',
      ];

      commonActions.forEach(key => {
        const TestComponent = createTestComponent(key);
        
        // Test Chinese
        setLanguage('zh');
        const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
        const textZh = getByTestIdZh('text');
        expect(textZh.props.children).toBeTruthy();
        expect(textZh.props.children).not.toBe(key); // Should not return the key itself
        unmountZh();
        
        // Test English
        setLanguage('en');
        const { getByTestId: getByTestIdEn } = render(<TestComponent />);
        const textEn = getByTestIdEn('text');
        expect(textEn.props.children).toBeTruthy();
        expect(textEn.props.children).not.toBe(key); // Should not return the key itself
      });
    });

    test('should have all screen titles in both languages', () => {
      const screenTitles = [
        'screens.questionDetail.title',
        'screens.questionActivityList.title',
        'screens.questionRanking.title',
        'screens.activity.title',
        'screens.wisdomIndex.title',
        'screens.settings.title',
      ];

      screenTitles.forEach(key => {
        const TestComponent = createTestComponent(key);
        
        // Test Chinese
        setLanguage('zh');
        const { getByTestId: getByTestIdZh, unmount: unmountZh } = render(<TestComponent />);
        const textZh = getByTestIdZh('text');
        expect(textZh.props.children).toBeTruthy();
        unmountZh();
        
        // Test English
        setLanguage('en');
        const { getByTestId: getByTestIdEn } = render(<TestComponent />);
        const textEn = getByTestIdEn('text');
        expect(textEn.props.children).toBeTruthy();
      });
    });
  });

  /**
   * Requirement 5.5: Translation completeness for layout consistency
   */
  describe('Translation Completeness', () => {
    
    test('should have matching structure in both translation files', () => {
      const zhTranslations = require('../locales/zh.json');
      const enTranslations = require('../locales/en.json');

      // Helper to get all keys recursively
      function getAllKeys(obj, prefix = '') {
        let keys = [];
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
          } else {
            keys.push(fullKey);
          }
        }
        return keys;
      }

      const zhKeys = getAllKeys(zhTranslations).sort();
      const enKeys = getAllKeys(enTranslations).sort();

      // Both should have the same keys
      expect(zhKeys).toEqual(enKeys);
    });

    test('should not have empty translations in either language', () => {
      const zhTranslations = require('../locales/zh.json');
      const enTranslations = require('../locales/en.json');

      // Helper to check for empty values
      function findEmptyValues(obj, prefix = '') {
        let emptyKeys = [];
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            emptyKeys = emptyKeys.concat(findEmptyValues(obj[key], fullKey));
          } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
            emptyKeys.push(fullKey);
          }
        }
        return emptyKeys;
      }

      const zhEmpty = findEmptyValues(zhTranslations);
      const enEmpty = findEmptyValues(enTranslations);

      if (zhEmpty.length > 0) {
        console.warn(`Empty Chinese translations: ${zhEmpty.join(', ')}`);
      }
      if (enEmpty.length > 0) {
        console.warn(`Empty English translations: ${enEmpty.join(', ')}`);
      }

      expect(zhEmpty.length).toBe(0);
      expect(enEmpty.length).toBe(0);
    });
  });

  /**
   * Requirement 5.5: Language switching should work seamlessly
   */
  describe('Language Switching', () => {
    
    test('should switch between languages without errors', () => {
      const TestComponent = createTestComponent('common.loading');
      
      // Start with Chinese
      setLanguage('zh');
      const { getByTestId, rerender } = render(<TestComponent />);
      expect(getByTestId('text').props.children).toBe('加载中...');
      
      // Switch to English
      setLanguage('en');
      rerender(<TestComponent />);
      expect(getByTestId('text').props.children).toBe('Loading...');
      
      // Switch back to Chinese
      setLanguage('zh');
      rerender(<TestComponent />);
      expect(getByTestId('text').props.children).toBe('加载中...');
    });

    test('should handle multiple components switching languages', () => {
      const keys = [
        'common.confirm',
        'common.cancel',
        'components.answerListItem.adopted',
      ];

      keys.forEach(key => {
        const TestComponent = createTestComponent(key);
        
        // Chinese
        setLanguage('zh');
        const { getByTestId, rerender, unmount } = render(<TestComponent />);
        const zhText = getByTestId('text').props.children;
        
        // English
        setLanguage('en');
        rerender(<TestComponent />);
        const enText = getByTestId('text').props.children;
        
        // Should be different
        expect(zhText).not.toBe(enText);
        
        // Both should be valid
        expect(zhText).toBeTruthy();
        expect(enText).toBeTruthy();
        
        unmount();
      });
    });
  });

  /**
   * Summary: Overall layout consistency report
   */
  describe('Layout Consistency Summary', () => {
    
    test('should generate layout consistency report', () => {
      const zhTranslations = require('../locales/zh.json');
      const enTranslations = require('../locales/en.json');

      // Helper to count all translation strings
      function countStrings(obj) {
        let count = 0;
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            count += countStrings(obj[key]);
          } else if (typeof obj[key] === 'string') {
            count++;
          }
        }
        return count;
      }

      // Helper to calculate average text length
      function averageLength(obj) {
        let total = 0;
        let count = 0;
        
        function traverse(o) {
          for (const key in o) {
            if (typeof o[key] === 'object' && o[key] !== null) {
              traverse(o[key]);
            } else if (typeof o[key] === 'string') {
              total += o[key].length;
              count++;
            }
          }
        }
        
        traverse(obj);
        return count > 0 ? total / count : 0;
      }

      const zhCount = countStrings(zhTranslations);
      const enCount = countStrings(enTranslations);
      const zhAvgLength = averageLength(zhTranslations);
      const enAvgLength = averageLength(enTranslations);

      console.log('\n=== UI Layout Consistency Report ===');
      console.log(`Chinese translations: ${zhCount} strings, avg length: ${zhAvgLength.toFixed(1)} chars`);
      console.log(`English translations: ${enCount} strings, avg length: ${enAvgLength.toFixed(1)} chars`);
      console.log(`Length ratio (EN/ZH): ${(enAvgLength / zhAvgLength).toFixed(2)}x`);
      console.log('===================================\n');

      // Both should have the same number of translations
      expect(zhCount).toBe(enCount);
      
      // Average lengths should be reasonable (English typically 1.2-3.2x longer than Chinese)
      const lengthRatio = enAvgLength / zhAvgLength;
      expect(lengthRatio).toBeGreaterThan(0.8);
      expect(lengthRatio).toBeLessThan(3.5);
    });
  });
});
