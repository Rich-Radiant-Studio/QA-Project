#!/usr/bin/env node

/**
 * Find Hardcoded Text Script
 * 
 * This script scans screen files for hardcoded Chinese text
 * and generates a detailed report with line numbers and context.
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
  magenta: '\x1b[35m',
};

// Screens with known issues
const SCREENS_TO_CHECK = [
  'QuestionDetailScreen.js',
  'ProfileScreen.js',
  'SupplementDetailScreen.js',
  'AnswerDetailScreen.js',
  'QuestionActivityListScreen.js',
  'WisdomIndexScreen.js',
  'TeamDetailScreen.js',
  'HotListScreen.js',
  'IncomeRankingScreen.js',
];

const SCREENS_DIR = path.join(__dirname, '../src/screens');

/**
 * Find hardcoded Chinese text in a file
 */
function findHardcodedChinese(content, filename) {
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
        line.includes('const wisdomData =') || line.includes('const examHistory =') ||
        line.includes('const mockUsers =') || line.includes('const mockQuestions =')) {
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
    
    // Skip object property definitions (like bankName:, bankAuthor:, etc.)
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
 * Categorize hardcoded text by type
 */
function categorizeHardcodedText(items) {
  const categories = {
    alerts: [],
    textElements: [],
    placeholders: [],
    titles: [],
    labels: [],
    other: [],
  };

  items.forEach(item => {
    if (item.content.includes('Alert.alert')) {
      categories.alerts.push(item);
    } else if (item.content.includes('<Text')) {
      categories.textElements.push(item);
    } else if (item.content.includes('placeholder=')) {
      categories.placeholders.push(item);
    } else if (item.content.includes('title=')) {
      categories.titles.push(item);
    } else if (item.content.includes('label=')) {
      categories.labels.push(item);
    } else {
      categories.other.push(item);
    }
  });

  return categories;
}

/**
 * Generate report for a single screen
 */
function generateScreenReport(filename) {
  const filePath = path.join(SCREENS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.red}✗ File not found: ${filename}${colors.reset}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const hardcodedText = findHardcodedChinese(content, filename);
  
  if (hardcodedText.length === 0) {
    console.log(`${colors.green}✓ ${filename}: No hardcoded text found${colors.reset}`);
    return null;
  }

  const categories = categorizeHardcodedText(hardcodedText);
  
  console.log(`\n${colors.cyan}=== ${filename} ===${colors.reset}`);
  console.log(`${colors.yellow}Total hardcoded text: ${hardcodedText.length}${colors.reset}\n`);

  // Print by category
  if (categories.alerts.length > 0) {
    console.log(`${colors.magenta}Alert Messages (${categories.alerts.length}):${colors.reset}`);
    categories.alerts.slice(0, 3).forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    if (categories.alerts.length > 3) {
      console.log(`  ... and ${categories.alerts.length - 3} more`);
    }
    console.log();
  }

  if (categories.textElements.length > 0) {
    console.log(`${colors.magenta}Text Elements (${categories.textElements.length}):${colors.reset}`);
    categories.textElements.slice(0, 3).forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    if (categories.textElements.length > 3) {
      console.log(`  ... and ${categories.textElements.length - 3} more`);
    }
    console.log();
  }

  if (categories.placeholders.length > 0) {
    console.log(`${colors.magenta}Placeholders (${categories.placeholders.length}):${colors.reset}`);
    categories.placeholders.forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    console.log();
  }

  if (categories.titles.length > 0) {
    console.log(`${colors.magenta}Titles (${categories.titles.length}):${colors.reset}`);
    categories.titles.forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    console.log();
  }

  if (categories.labels.length > 0) {
    console.log(`${colors.magenta}Labels (${categories.labels.length}):${colors.reset}`);
    categories.labels.forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    console.log();
  }

  if (categories.other.length > 0) {
    console.log(`${colors.magenta}Other (${categories.other.length}):${colors.reset}`);
    categories.other.slice(0, 3).forEach(item => {
      console.log(`  Line ${item.line}: ${item.content.substring(0, 80)}...`);
    });
    if (categories.other.length > 3) {
      console.log(`  ... and ${categories.other.length - 3} more`);
    }
    console.log();
  }

  return {
    filename,
    total: hardcodedText.length,
    categories,
  };
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.blue}Hardcoded Text Detection Report${colors.reset}`);
  console.log(`${colors.blue}================================${colors.reset}\n`);

  const results = [];
  let totalHardcoded = 0;

  SCREENS_TO_CHECK.forEach(filename => {
    const result = generateScreenReport(filename);
    if (result) {
      results.push(result);
      totalHardcoded += result.total;
    }
  });

  // Summary
  console.log(`\n${colors.cyan}=== Summary ===${colors.reset}`);
  console.log(`Screens checked: ${SCREENS_TO_CHECK.length}`);
  console.log(`Screens with issues: ${results.length}`);
  console.log(`Total hardcoded text instances: ${totalHardcoded}\n`);

  // Top offenders
  if (results.length > 0) {
    console.log(`${colors.yellow}Top Offenders:${colors.reset}`);
    results
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.filename}: ${result.total} instances`);
      });
  }

  console.log(`\n${colors.green}Report complete!${colors.reset}`);
}

// Run the script
main();
