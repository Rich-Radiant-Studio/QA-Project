/**
 * 调试模式配置
 * 用于在开发环境中模拟生产环境的行为
 */

// 设置为 true 可以在开发环境中模拟生产环境
// 现在使用本地构建，不再需要模拟生产环境
export const SIMULATE_PRODUCTION = false;

/**
 * 判断是否为生产环境（或模拟生产环境）
 */
export const isProduction = () => {
  if (SIMULATE_PRODUCTION) {
    console.log('🎭 模拟生产环境模式');
    return true;
  }
  return !__DEV__;
};

/**
 * 判断是否显示详细日志
 */
export const shouldShowDetailedLogs = () => {
  return __DEV__ && !SIMULATE_PRODUCTION;
};

export default {
  SIMULATE_PRODUCTION,
  isProduction,
  shouldShowDetailedLogs,
};
