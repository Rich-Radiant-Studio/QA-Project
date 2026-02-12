/**
 * Example usage of numberFormatter utility functions
 * 
 * This file demonstrates how to use the number formatting functions
 * with internationalization support.
 */

import { formatNumber, formatCurrency, formatPercent, formatCount } from './numberFormatter';

// ============================================
// formatNumber Examples
// ============================================

// Basic number formatting
console.log('=== formatNumber Examples ===');
console.log(formatNumber(256));           // "256" (both locales)
console.log(formatNumber(2560));          // Chinese: "2560", English: "2.6K"
console.log(formatNumber(25600));         // Chinese: "2.6万", English: "25.6K"
console.log(formatNumber(256000));        // Chinese: "25.6万", English: "256.0K"
console.log(formatNumber(2560000));       // Chinese: "256.0万", English: "2.6M"
console.log(formatNumber(256000000));     // Chinese: "2.6亿", English: "256.0M"

// Custom decimal places
console.log(formatNumber(25678, { decimals: 2 }));  // Chinese: "2.57万", English: "25.68K"
console.log(formatNumber(25678, { decimals: 0 }));  // Chinese: "3万", English: "26K"

// ============================================
// formatCurrency Examples
// ============================================

console.log('\n=== formatCurrency Examples ===');
console.log(formatCurrency(25.6));        // "$25.60" (both locales)
console.log(formatCurrency(256));         // "$256.00" (both locales)
console.log(formatCurrency(2560));        // Chinese: "$2560.00", English: "$2.6K"
console.log(formatCurrency(25600));       // Chinese: "$2.6万", English: "$25.6K"
console.log(formatCurrency(256000));      // Chinese: "$25.6万", English: "$256.0K"

// Custom options
console.log(formatCurrency(25.678, { decimals: 1 }));           // "$25.7"
console.log(formatCurrency(25600, { showSymbol: false }));      // Chinese: "2.6万", English: "25.6K"
console.log(formatCurrency(25600, { currency: '¥' }));          // Chinese: "¥2.6万", English: "¥25.6K"

// ============================================
// formatPercent Examples
// ============================================

console.log('\n=== formatPercent Examples ===');
console.log(formatPercent(85.5));         // "85.5%" (both locales)
console.log(formatPercent(100));          // "100.0%" (both locales)
console.log(formatPercent(0));            // "0.0%" (both locales)

// Decimal input (0-1 range)
console.log(formatPercent(0.855, { isDecimal: true }));         // "85.5%"
console.log(formatPercent(1, { isDecimal: true }));             // "100.0%"

// Custom options
console.log(formatPercent(85.567, { decimals: 2 }));            // "85.57%"
console.log(formatPercent(85.5, { showSymbol: false }));        // "85.5"

// ============================================
// formatCount Examples
// ============================================

console.log('\n=== formatCount Examples ===');
console.log(formatCount(256, 'people'));          // Chinese: "256人", English: "256 people"
console.log(formatCount(2560, 'people'));         // Chinese: "2560人", English: "2.6K people"
console.log(formatCount(25600, 'people'));        // Chinese: "2.6万人", English: "25.6K people"

console.log(formatCount(100, 'times'));           // Chinese: "100次", English: "100 times"
console.log(formatCount(1, 'times'));             // Chinese: "1次", English: "1 time"

console.log(formatCount(50, 'questions'));        // Chinese: "50个问题", English: "50 questions"
console.log(formatCount(1, 'questions'));         // Chinese: "1个问题", English: "1 question"

// Without abbreviation
console.log(formatCount(25600, 'people', { abbreviated: false }));  
// Chinese: "25600人", English: "25600 people"

// ============================================
// Real-world Component Usage Examples
// ============================================

console.log('\n=== Component Usage Examples ===');

// Example 1: Question stats
const questionStats = {
  views: 25600,
  answers: 128,
  followers: 2560
};

console.log('Views:', formatNumber(questionStats.views));
console.log('Answers:', formatNumber(questionStats.answers));
console.log('Followers:', formatNumber(questionStats.followers));

// Example 2: User profile stats
const userStats = {
  followers: 256000,
  likes: 128000,
  questions: 1250
};

console.log('Followers:', formatCount(userStats.followers, 'people'));
console.log('Likes:', formatNumber(userStats.likes));
console.log('Questions:', formatCount(userStats.questions, 'questions'));

// Example 3: Reward/Currency display
const rewardAmount = 25600;
console.log('Reward:', formatCurrency(rewardAmount));

// Example 4: Completion percentage
const completionRate = 85.5;
console.log('Completion:', formatPercent(completionRate));

// Example 5: Super Like balance
const superLikeBalance = 15;
console.log('Super Likes:', formatCount(superLikeBalance, 'times'));
