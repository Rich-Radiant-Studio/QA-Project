#!/usr/bin/env node

/**
 * Script to find unused translation keys in the codebase
 * Compares translation keys in JSON files with actual usage in code
 */

const fs = require('fs');
const path = require('path');

// Read translation files
const zhTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/zh.json'), 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/en.json'), 'utf8'));

// Get all translation keys from JSON
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const allKeys = getAllKeys(zhTranslations);
console.log(`Total translation keys: ${allKeys.length}`);

// Search for key usage in code files
function searchKeyUsage(key) {
  const glob = require('glob');
  
  try {
    // Find all JS/JSX/TS/TSX files
    const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', { cwd: path.join(__dirname, '..') });
    
    // Search for the key in each file
    for (const file of files) {
      const filePath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if the key appears in the file
      if (content.includes(key)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error searching for key ${key}:`, error.message);
    return false;
  }
}

// Find unused keys
console.log('\nSearching for unused keys...\n');
const unusedKeys = [];

for (const key of allKeys) {
  const isUsed = searchKeyUsage(key);
  if (!isUsed) {
    unusedKeys.push(key);
  }
}

// Report results
console.log(`\n=== Unused Translation Keys Report ===\n`);
console.log(`Total keys: ${allKeys.length}`);
console.log(`Used keys: ${allKeys.length - unusedKeys.length}`);
console.log(`Unused keys: ${unusedKeys.length}\n`);

if (unusedKeys.length > 0) {
  console.log('Unused keys:');
  unusedKeys.forEach(key => {
    console.log(`  - ${key}`);
  });
  
  // Save to file
  const reportPath = path.join(__dirname, '../.kiro/specs/i18n-completion/unused-keys-report.txt');
  fs.writeFileSync(reportPath, unusedKeys.join('\n'));
  console.log(`\nReport saved to: ${reportPath}`);
} else {
  console.log('All translation keys are being used! 🎉');
}
