import i18n from '../i18n';

/**
 * Format a number with locale-specific abbreviations
 * Chinese: 万 (10,000), 亿 (100,000,000)
 * English: K (1,000), M (1,000,000), B (1,000,000,000)
 * 
 * @param {number} num - The number to format
 * @param {Object} options - Formatting options
 * @param {number} options.decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string (e.g., "25.6万" or "25.6K")
 */
export function formatNumber(num, options = {}) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  const { decimals = 1 } = options;
  const locale = i18n.locale;
  
  // Chinese format: 万 (10,000), 亿 (100,000,000)
  if (locale === 'zh' || locale.startsWith('zh')) {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(decimals)}亿`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(decimals)}万`;
    }
    return num.toString();
  }
  
  // English format: K (1,000), M (1,000,000), B (1,000,000,000)
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toString();
}

/**
 * Format a currency amount with locale-specific formatting
 * Keeps the $ symbol but uses locale-appropriate number formatting
 * 
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @param {string} options.currency - Currency symbol (default: '$')
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @param {boolean} options.showSymbol - Whether to show currency symbol (default: true)
 * @returns {string} Formatted currency string (e.g., "$25.60" or "$25.6万")
 */
export function formatCurrency(amount, options = {}) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  
  const { 
    currency = '$', 
    decimals = 2, 
    showSymbol = true 
  } = options;
  
  const locale = i18n.locale;
  
  // For large amounts, use abbreviated format
  if (locale === 'zh' || locale.startsWith('zh')) {
    if (amount >= 10000) {
      const formatted = formatNumber(amount, { decimals });
      return showSymbol ? `${currency}${formatted}` : formatted;
    }
    // For smaller amounts, show full number with decimals
    const formatted = amount.toFixed(decimals);
    return showSymbol ? `${currency}${formatted}` : formatted;
  }
  
  // English format
  if (amount >= 1000) {
    const formatted = formatNumber(amount, { decimals });
    return showSymbol ? `${currency}${formatted}` : formatted;
  }
  
  const formatted = amount.toFixed(decimals);
  return showSymbol ? `${currency}${formatted}` : formatted;
}

/**
 * Format a percentage with locale-specific formatting
 * 
 * @param {number} value - The percentage value (0-100 or 0-1 depending on isDecimal)
 * @param {Object} options - Formatting options
 * @param {boolean} options.isDecimal - Whether input is decimal (0-1) or percentage (0-100) (default: false)
 * @param {number} options.decimals - Number of decimal places (default: 1)
 * @param {boolean} options.showSymbol - Whether to show % symbol (default: true)
 * @returns {string} Formatted percentage string (e.g., "85.5%" or "85.5%")
 */
export function formatPercent(value, options = {}) {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  
  const { 
    isDecimal = false, 
    decimals = 1, 
    showSymbol = true 
  } = options;
  
  // Convert decimal to percentage if needed
  const percentage = isDecimal ? value * 100 : value;
  
  // Ensure percentage is within valid range
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  const formatted = clampedPercentage.toFixed(decimals);
  return showSymbol ? `${formatted}%` : formatted;
}

/**
 * Format a count with locale-specific unit words
 * Chinese: 人 (people), 次 (times), 个 (items)
 * English: people, times, items
 * 
 * @param {number} count - The count to format
 * @param {string} unit - The unit type ('people', 'times', 'items')
 * @param {Object} options - Formatting options
 * @param {boolean} options.abbreviated - Use abbreviated number format (default: true)
 * @returns {string} Formatted count with unit (e.g., "25.6万人" or "25.6K people")
 */
export function formatCount(count, unit, options = {}) {
  if (typeof count !== 'number' || isNaN(count)) return '0';
  
  const { abbreviated = true } = options;
  const locale = i18n.locale;
  
  // Format the number
  const formattedNumber = abbreviated ? formatNumber(count) : count.toString();
  
  // Get unit translation
  let unitText = '';
  if (locale === 'zh' || locale.startsWith('zh')) {
    const unitMap = {
      'people': '人',
      'times': '次',
      'items': '个',
      'questions': '个问题',
      'answers': '个回答',
      'views': '次浏览'
    };
    unitText = unitMap[unit] || '';
  } else {
    const unitMap = {
      'people': count === 1 ? ' person' : ' people',
      'times': count === 1 ? ' time' : ' times',
      'items': count === 1 ? ' item' : ' items',
      'questions': count === 1 ? ' question' : ' questions',
      'answers': count === 1 ? ' answer' : ' answers',
      'views': count === 1 ? ' view' : ' views'
    };
    unitText = unitMap[unit] || '';
  }
  
  return `${formattedNumber}${unitText}`;
}
