/**
 * Safe Area 测试脚本
 * 用于验证响应式工具函数是否正常工作
 */

const { 
  scaleWidth, 
  scaleHeight, 
  scaleFont,
  getStatusBarHeight,
  getBottomSpace,
  hasNotch,
  SCREEN,
  SPACING,
  FONT_SIZE
} = require('./src/utils/responsive');

console.log('='.repeat(50));
console.log('Safe Area 响应式工具测试');
console.log('='.repeat(50));
console.log('');

console.log('📱 屏幕信息:');
console.log(`  宽度: ${SCREEN.width}px`);
console.log(`  高度: ${SCREEN.height}px`);
console.log(`  屏幕类型: ${SCREEN.isSmall ? '小屏' : SCREEN.isMedium ? '中屏' : '大屏'}`);
console.log('');

console.log('📏 安全区域:');
console.log(`  状态栏高度: ${getStatusBarHeight()}px`);
console.log(`  底部安全区域: ${getBottomSpace()}px`);
console.log(`  是否刘海屏: ${hasNotch() ? '是' : '否'}`);
console.log('');

console.log('🔢 响应式缩放示例:');
console.log(`  设计稿 16px → ${scaleWidth(16).toFixed(2)}px (宽度)`);
console.log(`  设计稿 20px → ${scaleHeight(20).toFixed(2)}px (高度)`);
console.log(`  设计稿 14px → ${scaleFont(14).toFixed(2)}px (字体)`);
console.log('');

console.log('📐 预定义间距 (SPACING):');
console.log(`  xs: ${SPACING.xs.toFixed(2)}px`);
console.log(`  sm: ${SPACING.sm.toFixed(2)}px`);
console.log(`  md: ${SPACING.md.toFixed(2)}px`);
console.log(`  lg: ${SPACING.lg.toFixed(2)}px`);
console.log(`  xl: ${SPACING.xl.toFixed(2)}px`);
console.log(`  xxl: ${SPACING.xxl.toFixed(2)}px`);
console.log('');

console.log('🔤 预定义字体大小 (FONT_SIZE):');
console.log(`  xs: ${FONT_SIZE.xs.toFixed(2)}px`);
console.log(`  sm: ${FONT_SIZE.sm.toFixed(2)}px`);
console.log(`  md: ${FONT_SIZE.md.toFixed(2)}px`);
console.log(`  lg: ${FONT_SIZE.lg.toFixed(2)}px`);
console.log(`  xl: ${FONT_SIZE.xl.toFixed(2)}px`);
console.log(`  xxl: ${FONT_SIZE.xxl.toFixed(2)}px`);
console.log(`  xxxl: ${FONT_SIZE.xxxl.toFixed(2)}px`);
console.log('');

console.log('✅ 响应式工具函数测试完成！');
console.log('='.repeat(50));
