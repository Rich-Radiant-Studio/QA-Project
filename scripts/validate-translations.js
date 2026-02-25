#!/usr/bin/env node

/**
 * Translation File Integrity Validation Script
 * 
 * This script validates the integrity of translation files (zh.json and en.json):
 * 1. Verifies that both files have the same key structure
 * 2. Verifies that all translation keys have corresponding values
 * 3. Verifies that there are no duplicate translation keys
 * 4. Generates a translation key usage report
 * 
 * Requirements: 4.1, 4.2, 4.4
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Paths to translation files
const ZH_PATH = path.join(__dirname, '../src/i18n/locales/zh.json');
const EN_PATH = path.join(__dirname, '../src/i18n/locales/en.json');

// Validation results
const results = {
  structureConsistency: { passed: true, errors: [] },
  missingValues: { passed: true, errors: [] },
  duplicateKeys: { passed: true, errors: [] },
  keyCount: { zh: 0, en: 0 },
  totalKeys: 0,
};

/**
 * Load and parse JSON file
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`${colors.red}Error loading ${filePath}:${colors.reset}`, error.message);
    process.exit(1);
  }
}

/**
 * Get all keys from a nested object with their paths
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get value at a specific key path
 */
function getValueAtPath(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}

/**
 * Check for duplicate keys in the same object
 */
function checkDuplicateKeys(obj, prefix = '', seen = new Set()) {
  const duplicates = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (seen.has(fullKey)) {
      duplicates.push(fullKey);
    } else {
      seen.add(fullKey);
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      duplicates.push(...checkDuplicateKeys(obj[key], fullKey, seen));
    }
  }
  
  return duplicates;
}

/**
 * Validate key structure consistency between two translation files
 */
function validateStructureConsistency(zhData, enData) {
  console.log(`\n${colors.cyan}=== Validating Key Structure Consistency ===${colors.reset}`);
  
  const zhKeys = getAllKeys(zhData).sort();
  const enKeys = getAllKeys(enData).sort();
  
  results.keyCount.zh = zhKeys.length;
  results.keyCount.en = enKeys.length;
  results.totalKeys = Math.max(zhKeys.length, enKeys.length);
  
  // Find keys only in zh.json
  const onlyInZh = zhKeys.filter(key => !enKeys.includes(key));
  if (onlyInZh.length > 0) {
    results.structureConsistency.passed = false;
    results.structureConsistency.errors.push({
      type: 'missing_in_en',
      keys: onlyInZh,
    });
  }
  
  // Find keys only in en.json
  const onlyInEn = enKeys.filter(key => !zhKeys.includes(key));
  if (onlyInEn.length > 0) {
    results.structureConsistency.passed = false;
    results.structureConsistency.errors.push({
      type: 'missing_in_zh',
      keys: onlyInEn,
    });
  }
  
  if (results.structureConsistency.passed) {
    console.log(`${colors.green}✓ Key structure is consistent${colors.reset}`);
    console.log(`  Total keys: ${results.totalKeys}`);
  } else {
    console.log(`${colors.red}✗ Key structure inconsistency detected${colors.reset}`);
    
    if (onlyInZh.length > 0) {
      console.log(`\n  ${colors.yellow}Keys only in zh.json (${onlyInZh.length}):${colors.reset}`);
      onlyInZh.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      if (onlyInZh.length > 10) {
        console.log(`    ... and ${onlyInZh.length - 10} more`);
      }
    }
    
    if (onlyInEn.length > 0) {
      console.log(`\n  ${colors.yellow}Keys only in en.json (${onlyInEn.length}):${colors.reset}`);
      onlyInEn.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      if (onlyInEn.length > 10) {
        console.log(`    ... and ${onlyInEn.length - 10} more`);
      }
    }
  }
}

/**
 * Validate that all translation keys have non-empty values
 */
function validateMissingValues(zhData, enData) {
  console.log(`\n${colors.cyan}=== Validating Translation Values ===${colors.reset}`);
  
  const zhKeys = getAllKeys(zhData);
  const enKeys = getAllKeys(enData);
  
  const zhMissing = [];
  const enMissing = [];
  
  // Check zh.json for empty values
  zhKeys.forEach(key => {
    const value = getValueAtPath(zhData, key);
    if (value === '' || value === null || value === undefined) {
      zhMissing.push(key);
    }
  });
  
  // Check en.json for empty values
  enKeys.forEach(key => {
    const value = getValueAtPath(enData, key);
    if (value === '' || value === null || value === undefined) {
      enMissing.push(key);
    }
  });
  
  if (zhMissing.length > 0) {
    results.missingValues.passed = false;
    results.missingValues.errors.push({
      file: 'zh.json',
      keys: zhMissing,
    });
  }
  
  if (enMissing.length > 0) {
    results.missingValues.passed = false;
    results.missingValues.errors.push({
      file: 'en.json',
      keys: enMissing,
    });
  }
  
  if (results.missingValues.passed) {
    console.log(`${colors.green}✓ All translation keys have values${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Missing or empty translation values detected${colors.reset}`);
    
    if (zhMissing.length > 0) {
      console.log(`\n  ${colors.yellow}Empty values in zh.json (${zhMissing.length}):${colors.reset}`);
      zhMissing.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      if (zhMissing.length > 10) {
        console.log(`    ... and ${zhMissing.length - 10} more`);
      }
    }
    
    if (enMissing.length > 0) {
      console.log(`\n  ${colors.yellow}Empty values in en.json (${enMissing.length}):${colors.reset}`);
      enMissing.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      if (enMissing.length > 10) {
        console.log(`    ... and ${enMissing.length - 10} more`);
      }
    }
  }
}

/**
 * Validate that there are no duplicate keys
 */
function validateDuplicateKeys(zhData, enData) {
  console.log(`\n${colors.cyan}=== Validating Duplicate Keys ===${colors.reset}`);
  
  const zhDuplicates = checkDuplicateKeys(zhData);
  const enDuplicates = checkDuplicateKeys(enData);
  
  if (zhDuplicates.length > 0) {
    results.duplicateKeys.passed = false;
    results.duplicateKeys.errors.push({
      file: 'zh.json',
      keys: zhDuplicates,
    });
  }
  
  if (enDuplicates.length > 0) {
    results.duplicateKeys.passed = false;
    results.duplicateKeys.errors.push({
      file: 'en.json',
      keys: enDuplicates,
    });
  }
  
  if (results.duplicateKeys.passed) {
    console.log(`${colors.green}✓ No duplicate keys found${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Duplicate keys detected${colors.reset}`);
    
    if (zhDuplicates.length > 0) {
      console.log(`\n  ${colors.yellow}Duplicates in zh.json (${zhDuplicates.length}):${colors.reset}`);
      zhDuplicates.forEach(key => console.log(`    - ${key}`));
    }
    
    if (enDuplicates.length > 0) {
      console.log(`\n  ${colors.yellow}Duplicates in en.json (${enDuplicates.length}):${colors.reset}`);
      enDuplicates.forEach(key => console.log(`    - ${key}`));
    }
  }
}

/**
 * Generate translation key usage report
 */
function generateUsageReport(zhData, enData) {
  console.log(`\n${colors.cyan}=== Translation Key Usage Report ===${colors.reset}`);
  
  const zhKeys = getAllKeys(zhData);
  const namespaces = {};
  
  // Group keys by namespace
  zhKeys.forEach(key => {
    const parts = key.split('.');
    const namespace = parts[0];
    
    if (!namespaces[namespace]) {
      namespaces[namespace] = {
        count: 0,
        subNamespaces: new Set(),
      };
    }
    
    namespaces[namespace].count++;
    
    if (parts.length > 1) {
      namespaces[namespace].subNamespaces.add(parts[1]);
    }
  });
  
  console.log(`\n${colors.blue}Translation Key Distribution:${colors.reset}`);
  console.log(`  Total keys: ${results.totalKeys}`);
  console.log(`  zh.json keys: ${results.keyCount.zh}`);
  console.log(`  en.json keys: ${results.keyCount.en}`);
  
  console.log(`\n${colors.blue}Keys by Namespace:${colors.reset}`);
  Object.entries(namespaces)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([namespace, data]) => {
      console.log(`  ${namespace}: ${data.count} keys`);
      if (data.subNamespaces.size > 0) {
        console.log(`    Sub-namespaces: ${Array.from(data.subNamespaces).slice(0, 5).join(', ')}${data.subNamespaces.size > 5 ? '...' : ''}`);
      }
    });
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, '../translation-validation-report.json');
  const detailedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalKeys: results.totalKeys,
      zhKeyCount: results.keyCount.zh,
      enKeyCount: results.keyCount.en,
      structureConsistent: results.structureConsistency.passed,
      allValuesPresent: results.missingValues.passed,
      noDuplicates: results.duplicateKeys.passed,
    },
    namespaces: Object.entries(namespaces).map(([name, data]) => ({
      name,
      keyCount: data.count,
      subNamespaces: Array.from(data.subNamespaces),
    })),
    errors: {
      structureConsistency: results.structureConsistency.errors,
      missingValues: results.missingValues.errors,
      duplicateKeys: results.duplicateKeys.errors,
    },
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
  console.log(`\n${colors.green}Detailed report saved to: ${reportPath}${colors.reset}`);
}

/**
 * Print final summary
 */
function printSummary() {
  console.log(`\n${colors.cyan}=== Validation Summary ===${colors.reset}`);
  
  const allPassed = results.structureConsistency.passed && 
                    results.missingValues.passed && 
                    results.duplicateKeys.passed;
  
  if (allPassed) {
    console.log(`\n${colors.green}✓ All validation checks passed!${colors.reset}`);
    console.log(`  - Key structure is consistent`);
    console.log(`  - All translation keys have values`);
    console.log(`  - No duplicate keys found`);
    console.log(`  - Total keys: ${results.totalKeys}`);
  } else {
    console.log(`\n${colors.red}✗ Validation failed${colors.reset}`);
    
    if (!results.structureConsistency.passed) {
      console.log(`  ${colors.red}✗ Key structure inconsistency${colors.reset}`);
    } else {
      console.log(`  ${colors.green}✓ Key structure is consistent${colors.reset}`);
    }
    
    if (!results.missingValues.passed) {
      console.log(`  ${colors.red}✗ Missing or empty values${colors.reset}`);
    } else {
      console.log(`  ${colors.green}✓ All keys have values${colors.reset}`);
    }
    
    if (!results.duplicateKeys.passed) {
      console.log(`  ${colors.red}✗ Duplicate keys found${colors.reset}`);
    } else {
      console.log(`  ${colors.green}✓ No duplicate keys${colors.reset}`);
    }
  }
  
  return allPassed ? 0 : 1;
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.blue}Translation File Integrity Validation${colors.reset}`);
  console.log(`${colors.blue}=====================================${colors.reset}`);
  
  // Load translation files
  console.log(`\nLoading translation files...`);
  const zhData = loadJSON(ZH_PATH);
  const enData = loadJSON(EN_PATH);
  console.log(`${colors.green}✓ Translation files loaded successfully${colors.reset}`);
  
  // Run validations
  validateStructureConsistency(zhData, enData);
  validateMissingValues(zhData, enData);
  validateDuplicateKeys(zhData, enData);
  generateUsageReport(zhData, enData);
  
  // Print summary and exit
  const exitCode = printSummary();
  process.exit(exitCode);
}

// Run the script
main();
