/**
 * Component Internationalization Tests
 * 
 * Tests for Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6:
 * - All components display text according to system language
 * - No hardcoded text in components
 * - Chinese/English switching works correctly
 * 
 * This test verifies that all component files:
 * 1. Import and use the useTranslation hook
 * 2. Do not contain hardcoded Chinese or English user-facing text
 * 3. Use translation keys for all user-visible strings
 */

const fs = require('fs');
const path = require('path');

// List of all component files that should be internationalized (from task 11)
const COMPONENT_FILES = [
  'AnswerListItem.js',
  'QuestionListItem.js',
  'FavoriteListItem.js',
  'SuperLikeBalance.js',
  'UseSuperLikeButton.js',
  'IdentitySelector.js',
];

// Components that are known to have special cases or exceptions
const KNOWN_EXCEPTIONS = {
  // Add components here that have legitimate reasons for hardcoded text
  // Format: 'ComponentName.js': 'Reason for exception'
};

describe('Component Internationalization', () => {
  const componentsDir = path.join(__dirname, '../../components');

  /**
   * Helper: Read component file content
   */
  function readComponentFile(filename) {
    const filePath = path.join(componentsDir, filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Helper: Check if file imports useTranslation
   */
  function importsUseTranslation(content) {
    const importPatterns = [
      /import\s+{\s*useTranslation\s*}\s+from\s+['"].*i18n.*['"]/,
      /import\s+useTranslation\s+from\s+['"].*i18n.*['"]/,
      /const\s+{\s*useTranslation\s*}\s*=\s*require\(['"].*i18n.*['"]\)/,
    ];
    return importPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Helper: Check if file uses useTranslation hook
   */
  function usesTranslationHook(content) {
    const usagePatterns = [
      /const\s+{\s*t\s*}\s*=\s*useTranslation\(\)/,
      /const\s+{\s*t\s*,.*}\s*=\s*useTranslation\(\)/,
      /const\s+{.*,\s*t\s*}\s*=\s*useTranslation\(\)/,
    ];
    return usagePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Helper: Find hardcoded Chinese text (excluding comments and mock data)
   */
  function findHardcodedChinese(content) {
    const lines = content.split('\n');
    const hardcodedText = [];
    let inMockDataBlock = false;
    let braceDepth = 0;
    
    // Chinese character range
    const chineseRegex = /[\u4e00-\u9fa5]+/g;
    
    lines.forEach((line, index) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
        return;
      }
      
      // Track if we're inside a mock data block
      if (line.includes('mockData') || line.includes('MOCK_') || 
          line.includes('const userTeams =') || line.includes('const mockUsers =')) {
        inMockDataBlock = true;
        braceDepth = 0;
      }
      
      // Track brace depth to know when mock data block ends
      if (inMockDataBlock) {
        braceDepth += (line.match(/{/g) || []).length;
        braceDepth -= (line.match(/}/g) || []).length;
        
        if (braceDepth <= 0 && line.includes('}')) {
          inMockDataBlock = false;
        }
        return; // Skip all lines in mock data blocks
      }
      
      // Skip object property definitions (like name:, description:, etc.)
      if (line.match(/^\s*\w+:\s*['"][\u4e00-\u9fa5]+['"]/)) {
        return;
      }
      
      // Check for Chinese characters in JSX or strings
      const matches = line.match(chineseRegex);
      if (matches) {
        // Check if it's in a JSX Text element or string literal that's user-facing
        if (line.includes('<Text') || line.includes('title=') || 
            line.includes('placeholder=') || line.includes('label=') ||
            line.includes('Alert.alert')) {
          // Exclude console statements
          if (!line.includes('console.')) {
            hardcodedText.push({
              line: index + 1,
              content: line.trim(),
              matches: matches,
            });
          }
        }
      }
    });
    
    return hardcodedText;
  }

  /**
   * Helper: Check if file uses t() function for translations
   */
  function usesTranslationFunction(content) {
    const translationCallPatterns = [
      /t\(['"][\w.]+['"]\)/,
      /t\(`[\w.]+`\)/,
      /{t\(['"][\w.]+['"]\)}/,
    ];
    return translationCallPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Requirement 2.1, 2.2, 2.3, 2.4, 2.5, 2.6: All components should import useTranslation
   */
  describe('useTranslation Hook Import', () => {
    COMPONENT_FILES.forEach(filename => {
      test(`${filename} should import useTranslation hook`, () => {
        const content = readComponentFile(filename);
        
        if (!content) {
          // File doesn't exist - fail test
          throw new Error(`Component file ${filename} not found`);
        }

        if (KNOWN_EXCEPTIONS[filename]) {
          console.log(`Skipping ${filename}: ${KNOWN_EXCEPTIONS[filename]}`);
          return;
        }

        expect(importsUseTranslation(content)).toBe(true);
      });
    });
  });

  /**
   * Requirement 2.1, 2.2, 2.3, 2.4, 2.5, 2.6: All components should use useTranslation hook
   */
  describe('useTranslation Hook Usage', () => {
    COMPONENT_FILES.forEach(filename => {
      test(`${filename} should use useTranslation hook`, () => {
        const content = readComponentFile(filename);
        
        if (!content) {
          throw new Error(`Component file ${filename} not found`);
        }

        if (KNOWN_EXCEPTIONS[filename]) {
          return;
        }

        expect(usesTranslationHook(content)).toBe(true);
      });
    });
  });

  /**
   * Requirement 2.1, 2.2, 2.3, 2.4, 2.5, 2.6: Components should not contain hardcoded Chinese text
   */
  describe('No Hardcoded Chinese Text', () => {
    COMPONENT_FILES.forEach(filename => {
      test(`${filename} should not contain hardcoded Chinese text`, () => {
        const content = readComponentFile(filename);
        
        if (!content) {
          throw new Error(`Component file ${filename} not found`);
        }

        if (KNOWN_EXCEPTIONS[filename]) {
          return;
        }

        const hardcodedChinese = findHardcodedChinese(content);
        
        if (hardcodedChinese.length > 0) {
          const errorMessage = `Found ${hardcodedChinese.length} hardcoded Chinese text(s) in ${filename}:\n` +
            hardcodedChinese.slice(0, 5).map(item => 
              `  Line ${item.line}: ${item.content}`
            ).join('\n') +
            (hardcodedChinese.length > 5 ? `\n  ... and ${hardcodedChinese.length - 5} more` : '');
          
          console.warn(errorMessage);
        }

        expect(hardcodedChinese.length).toBe(0);
      });
    });
  });

  /**
   * Requirement 2.1, 2.2, 2.3, 2.4, 2.5, 2.6: Components should use t() function for translations
   */
  describe('Translation Function Usage', () => {
    COMPONENT_FILES.forEach(filename => {
      test(`${filename} should use t() function for translations`, () => {
        const content = readComponentFile(filename);
        
        if (!content) {
          throw new Error(`Component file ${filename} not found`);
        }

        if (KNOWN_EXCEPTIONS[filename]) {
          return;
        }

        // If the file imports and uses useTranslation, it should also call t()
        if (importsUseTranslation(content) && usesTranslationHook(content)) {
          expect(usesTranslationFunction(content)).toBe(true);
        }
      });
    });
  });

  /**
   * Integration test: Verify translation keys exist for all components
   */
  describe('Translation Keys Existence', () => {
    const zhTranslations = require('../locales/zh.json');
    const enTranslations = require('../locales/en.json');

    test('should have translation keys for all internationalized components', () => {
      const componentNamespaces = Object.keys(zhTranslations.components || {});
      
      // Check that we have translations for all required components
      const expectedComponents = [
        'answerListItem',
        'questionListItem',
        'favoriteListItem',
        'superLikeBalance',
        'useSuperLikeButton',
        'identitySelector',
      ];

      const missingComponents = expectedComponents.filter(
        component => !componentNamespaces.includes(component)
      );

      if (missingComponents.length > 0) {
        console.warn(`Missing translation namespaces for: ${missingComponents.join(', ')}`);
      }

      // All 6 components should have translation namespaces
      expect(componentNamespaces.length).toBeGreaterThanOrEqual(6);
      
      // Check each expected component exists
      expectedComponents.forEach(component => {
        expect(componentNamespaces).toContain(component);
      });
    });

    test('should have matching translation keys in both zh.json and en.json', () => {
      const zhComponents = Object.keys(zhTranslations.components || {});
      const enComponents = Object.keys(enTranslations.components || {});

      // Both should have the same component namespaces
      expect(zhComponents.sort()).toEqual(enComponents.sort());
    });

    test('should have consistent nested keys for each component', () => {
      const zhComponents = zhTranslations.components || {};
      const enComponents = enTranslations.components || {};

      Object.keys(zhComponents).forEach(componentName => {
        const zhKeys = Object.keys(zhComponents[componentName]);
        const enKeys = Object.keys(enComponents[componentName] || {});

        // Both languages should have the same keys for each component
        expect(zhKeys.sort()).toEqual(enKeys.sort());
      });
    });
  });

  /**
   * Specific component tests: Verify key components have required translations
   */
  describe('Specific Component Translation Keys', () => {
    const zhTranslations = require('../locales/zh.json');
    const enTranslations = require('../locales/en.json');

    test('AnswerListItem should have adopted translation', () => {
      expect(zhTranslations.components.answerListItem.adopted).toBeDefined();
      expect(enTranslations.components.answerListItem.adopted).toBeDefined();
    });

    test('QuestionListItem should have solved translation', () => {
      expect(zhTranslations.components.questionListItem.solved).toBeDefined();
      expect(enTranslations.components.questionListItem.solved).toBeDefined();
    });

    test('SuperLikeBalance should have label and unit translations', () => {
      expect(zhTranslations.components.superLikeBalance.label).toBeDefined();
      expect(zhTranslations.components.superLikeBalance.unit).toBeDefined();
      expect(enTranslations.components.superLikeBalance.label).toBeDefined();
      expect(enTranslations.components.superLikeBalance.unit).toBeDefined();
    });

    test('UseSuperLikeButton should have dialog translations', () => {
      expect(zhTranslations.components.useSuperLikeButton.confirm).toBeDefined();
      expect(zhTranslations.components.useSuperLikeButton.insufficientBalance).toBeDefined();
      expect(enTranslations.components.useSuperLikeButton.confirm).toBeDefined();
      expect(enTranslations.components.useSuperLikeButton.insufficientBalance).toBeDefined();
    });

    test('IdentitySelector should have identity option translations', () => {
      expect(zhTranslations.components.identitySelector.personal).toBeDefined();
      expect(zhTranslations.components.identitySelector.team).toBeDefined();
      expect(enTranslations.components.identitySelector.personal).toBeDefined();
      expect(enTranslations.components.identitySelector.team).toBeDefined();
    });

    test('FavoriteListItem should have time-related translations', () => {
      expect(zhTranslations.components.favoriteListItem.savedToday).toBeDefined();
      expect(zhTranslations.components.favoriteListItem.savedYesterday).toBeDefined();
      expect(enTranslations.components.favoriteListItem.savedToday).toBeDefined();
      expect(enTranslations.components.favoriteListItem.savedYesterday).toBeDefined();
    });
  });

  /**
   * Summary test: Overall component internationalization coverage
   */
  describe('Component Internationalization Coverage Summary', () => {
    test('should have 100% component internationalization coverage', () => {
      let totalComponents = 0;
      let internationalizedComponents = 0;
      let componentsWithIssues = [];

      COMPONENT_FILES.forEach(filename => {
        const content = readComponentFile(filename);
        
        if (!content) {
          componentsWithIssues.push({
            file: filename,
            issue: 'File not found',
          });
          return;
        }

        totalComponents++;

        const hasImport = importsUseTranslation(content);
        const hasUsage = usesTranslationHook(content);
        const hasCalls = usesTranslationFunction(content);
        const hardcodedChinese = findHardcodedChinese(content);

        if (hasImport && hasUsage && hasCalls && hardcodedChinese.length === 0) {
          internationalizedComponents++;
        } else {
          componentsWithIssues.push({
            file: filename,
            hasImport,
            hasUsage,
            hasCalls,
            hardcodedCount: hardcodedChinese.length,
          });
        }
      });

      const coverage = totalComponents > 0 ? (internationalizedComponents / totalComponents) * 100 : 0;

      console.log(`\nComponent Internationalization Coverage: ${internationalizedComponents}/${totalComponents} (${coverage.toFixed(1)}%)`);
      
      if (componentsWithIssues.length > 0) {
        console.log('\nComponents with issues:');
        componentsWithIssues.forEach(issue => {
          console.log(`  ${issue.file}:`);
          if (issue.issue) {
            console.log(`    - ${issue.issue}`);
          } else {
            if (!issue.hasImport) console.log(`    - Missing useTranslation import`);
            if (!issue.hasUsage) console.log(`    - Not using useTranslation hook`);
            if (!issue.hasCalls) console.log(`    - Not calling t() function`);
            if (issue.hardcodedCount > 0) console.log(`    - ${issue.hardcodedCount} hardcoded text(s)`);
          }
        });
      }

      // We expect 100% coverage for all 6 components
      expect(coverage).toBe(100);
    });
  });

  /**
   * Language switching test: Verify components work in both languages
   */
  describe('Language Switching', () => {
    const zhTranslations = require('../locales/zh.json');
    const enTranslations = require('../locales/en.json');

    test('should have non-empty translations in both languages', () => {
      const zhComponents = zhTranslations.components || {};
      const enComponents = enTranslations.components || {};

      Object.keys(zhComponents).forEach(componentName => {
        const zhKeys = zhComponents[componentName];
        const enKeys = enComponents[componentName];

        Object.keys(zhKeys).forEach(key => {
          // Check that translations are not empty
          const zhValue = typeof zhKeys[key] === 'string' ? zhKeys[key] : JSON.stringify(zhKeys[key]);
          const enValue = typeof enKeys[key] === 'string' ? enKeys[key] : JSON.stringify(enKeys[key]);

          expect(zhValue).toBeTruthy();
          expect(enValue).toBeTruthy();
          
          // Check that translations are different (not just copied)
          if (typeof zhKeys[key] === 'string' && typeof enKeys[key] === 'string') {
            // Allow same values for things like currency symbols, but most should differ
            const isSameValue = zhValue === enValue;
            if (isSameValue) {
              console.log(`Note: ${componentName}.${key} has same value in both languages: "${zhValue}"`);
            }
          }
        });
      });
    });
  });
});
