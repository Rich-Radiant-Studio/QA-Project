import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 设计稿基准尺寸（通常使用 iPhone 6/7/8 的尺寸）
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

/**
 * 根据屏幕宽度缩放尺寸
 * @param {number} size - 设计稿中的尺寸
 * @returns {number} - 缩放后的尺寸
 */
export const scaleWidth = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * 根据屏幕高度缩放尺寸
 * @param {number} size - 设计稿中的尺寸
 * @returns {number} - 缩放后的尺寸
 */
export const scaleHeight = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * 根据屏幕宽度和高度的平均值缩放尺寸（用于字体）
 * @param {number} size - 设计稿中的字体大小
 * @returns {number} - 缩放后的字体大小
 */
export const scaleFont = (size) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  return Math.round(size * scale);
};

/**
 * 获取状态栏高度
 * @returns {number} - 状态栏高度
 */
export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    // iOS 设备
    if (SCREEN_HEIGHT >= 812) {
      // iPhone X 及以上（有刘海屏）
      return 44;
    }
    return 20;
  } else {
    // Android 设备
    return StatusBar.currentHeight || 0;
  }
};

/**
 * 获取底部安全区域高度
 * @returns {number} - 底部安全区域高度
 */
export const getBottomSpace = () => {
  if (Platform.OS === 'ios' && SCREEN_HEIGHT >= 812) {
    // iPhone X 及以上
    return 34;
  }
  return 0;
};

/**
 * 判断是否为刘海屏/挖孔屏
 * @returns {boolean}
 */
export const hasNotch = () => {
  if (Platform.OS === 'ios') {
    return SCREEN_HEIGHT >= 812;
  } else {
    // Android 设备通过状态栏高度判断
    const statusBarHeight = StatusBar.currentHeight || 0;
    return statusBarHeight > 24;
  }
};

/**
 * 获取安全的头部内边距
 * @param {number} additionalPadding - 额外的内边距
 * @returns {number}
 */
export const getSafeTopPadding = (additionalPadding = 0) => {
  return getStatusBarHeight() + additionalPadding;
};

/**
 * 获取安全的底部内边距
 * @param {number} additionalPadding - 额外的内边距
 * @returns {number}
 */
export const getSafeBottomPadding = (additionalPadding = 0) => {
  return getBottomSpace() + additionalPadding;
};

// 导出屏幕尺寸
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
};

// 导出常用间距（响应式）
export const SPACING = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(12),
  lg: scaleWidth(16),
  xl: scaleWidth(20),
  xxl: scaleWidth(24),
};

// 导出常用字体大小（响应式）
export const FONT_SIZE = {
  xs: scaleFont(10),
  sm: scaleFont(12),
  md: scaleFont(14),
  lg: scaleFont(16),
  xl: scaleFont(18),
  xxl: scaleFont(20),
  xxxl: scaleFont(24),
};

export default {
  scaleWidth,
  scaleHeight,
  scaleFont,
  getStatusBarHeight,
  getBottomSpace,
  hasNotch,
  getSafeTopPadding,
  getSafeBottomPadding,
  SCREEN,
  SPACING,
  FONT_SIZE,
};
