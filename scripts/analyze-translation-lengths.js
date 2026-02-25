/**
 * Analyze translation file statistics for UI layout testing
 */

const fs = require('fs');
const path = require('path');

// Load translation files
const zhPath = path.join(__dirname, '../src/i18n/locales/zh.json');
const enPath = path.join(__dirname, '../src/i18n/locales/en.json');

const zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

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

// Calculate statistics
const zhCount = countStrings(zhTranslations);
const enCount = countStrings(enTranslations);
const zhAvgLength = averageLength(zhTranslations);
const enAvgLength = averageLength(enTranslations);
const lengthRatio = enAvgLength / zhAvgLength;

// Output results
console.log('\n=== UI Layout Consistency Report ===');
console.log(`Chinese translations: ${zhCount} strings, avg length: ${zhAvgLength.toFixed(1)} chars`);
console.log(`English translations: ${enCount} strings, avg length: ${enAvgLength.toFixed(1)} chars`);
console.log(`Length ratio (EN/ZH): ${lengthRatio.toFixed(2)}x`);
console.log('===================================\n');

// Additional analysis
console.log('Translation Coverage:');
console.log(`- Both files have ${zhCount === enCount ? 'matching' : 'different'} number of strings`);
console.log(`- English text is on average ${lengthRatio.toFixed(1)}x longer than Chinese`);
console.log(`- This ratio is ${lengthRatio >= 0.8 && lengthRatio <= 3.5 ? 'within' : 'outside'} expected range (0.8-3.5x)\n`);
