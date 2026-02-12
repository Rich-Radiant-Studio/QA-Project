import i18n from '../i18n';

/**
 * Format a timestamp or Date object into a relative time string with internationalization support
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted time string (e.g., "2 hours ago", "Yesterday", "Just now")
 */
export function formatTime(date) {
  if (!date) return '';
  
  const now = new Date();
  const targetDate = new Date(date);
  
  // Calculate time difference in milliseconds
  const diffMs = now - targetDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Just now (less than 1 minute)
  if (diffMinutes < 1) {
    return i18n.t('common.time.justNow') || i18n.t('home.justNow');
  }
  
  // Minutes ago (1-59 minutes)
  if (diffMinutes < 60) {
    const minutesText = i18n.t('common.time.minutesAgo') || i18n.t('home.minutesAgo');
    return `${diffMinutes}${minutesText}`;
  }
  
  // Hours ago (1-23 hours)
  if (diffHours < 24) {
    const hoursText = i18n.t('common.time.hoursAgo') || i18n.t('home.hoursAgo');
    return `${diffHours}${hoursText}`;
  }
  
  // Yesterday
  if (diffDays === 1) {
    return i18n.t('common.time.yesterday') || i18n.t('home.yesterday');
  }
  
  // Days ago (2-6 days)
  if (diffDays < 7) {
    const daysText = i18n.t('common.time.daysAgo') || i18n.t('home.daysAgo');
    return `${diffDays}${daysText}`;
  }
  
  // For dates older than 7 days, return formatted date
  return formatDate(targetDate);
}

/**
 * Format a date into a localized date string
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include time (default: false)
 * @param {boolean} options.short - Use short format (default: false)
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return '';
  
  const { includeTime = false, short = false } = options;
  const targetDate = new Date(date);
  
  // Get current locale
  const locale = i18n.locale;
  
  // Format based on locale
  if (locale === 'zh' || locale.startsWith('zh')) {
    // Chinese format: YYYY年MM月DD日 or YYYY-MM-DD
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    
    if (short) {
      const dateStr = `${year}-${month}-${day}`;
      if (includeTime) {
        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}`;
      }
      return dateStr;
    }
    
    const dateStr = `${year}年${month}月${day}日`;
    if (includeTime) {
      const hours = String(targetDate.getHours()).padStart(2, '0');
      const minutes = String(targetDate.getMinutes()).padStart(2, '0');
      return `${dateStr} ${hours}:${minutes}`;
    }
    return dateStr;
  } else {
    // English format: MMM DD, YYYY or MM/DD/YYYY
    if (short) {
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const year = targetDate.getFullYear();
      const dateStr = `${month}/${day}/${year}`;
      
      if (includeTime) {
        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}`;
      }
      return dateStr;
    }
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return targetDate.toLocaleDateString('en-US', options);
  }
}

/**
 * Format duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "05:30")
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
