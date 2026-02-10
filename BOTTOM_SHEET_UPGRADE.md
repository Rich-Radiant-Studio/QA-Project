# 底部抽屉弹窗升级说明

## 问题背景
之前使用 React Native 的 Modal 组件实现底部弹窗，在真机上存在严重的键盘适配问题：
- 键盘弹起时，弹窗底部与键盘之间有大量空白
- 使用 KeyboardAvoidingView 无法完美解决
- Android 和 iOS 表现不一致

## 解决方案
采用业界标准库 `@gorhom/bottom-sheet`，这是抖音、微信等大厂 APP 使用的底部抽屉方案。

## 技术栈
- **@gorhom/bottom-sheet**: 专业的底部抽屉组件
- **react-native-reanimated**: 高性能动画库
- **react-native-gesture-handler**: 手势处理库

## 核心特性

### 1. 完美的键盘适配
```javascript
<BottomSheet
  keyboardBehavior="interactive"
  keyboardBlurBehavior="restore"
  android_keyboardInputMode="adjustResize"
>
```
- `keyboardBehavior="interactive"`: 键盘交互式调整
- `keyboardBlurBehavior="restore"`: 键盘收起时恢复位置
- `android_keyboardInputMode="adjustResize"`: Android 自动调整大小

### 2. 手势交互
- 支持下拉关闭 (`enablePanDownToClose`)
- 支持多个停靠点 (`snapPoints`)
- 流畅的动画效果

### 3. 背景遮罩
```javascript
const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.5}
  />
);
```

## 配置步骤

### 1. 安装依赖
```bash
npm install @gorhom/bottom-sheet@^4 react-native-reanimated react-native-gesture-handler
```

### 2. 配置 Babel
在 `babel.config.js` 中添加 reanimated 插件：
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // 必须放在最后
  };
};
```

### 3. 配置 App.js
用 `GestureHandlerRootView` 包裹整个应用：
```javascript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* 其他内容 */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

### 4. 使用 BottomSheet
```javascript
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const bottomSheetRef = useRef(null);
const snapPoints = useMemo(() => ['75%', '90%'], []);

// 打开
bottomSheetRef.current?.expand();

// 关闭
bottomSheetRef.current?.close();
```

## 优势对比

| 特性 | Modal 方案 | BottomSheet 方案 |
|------|-----------|-----------------|
| 键盘适配 | ❌ 需要手动处理 | ✅ 自动完美适配 |
| 手势交互 | ❌ 不支持 | ✅ 原生级体验 |
| 性能 | ⚠️ 一般 | ✅ 高性能动画 |
| 真机表现 | ❌ 有 Bug | ✅ 完美运行 |
| 代码复杂度 | ⚠️ 需要大量适配代码 | ✅ 简洁清晰 |

## 注意事项

1. **重启应用**: 修改 babel.config.js 后需要完全重启 Metro bundler
2. **清除缓存**: 
   ```bash
   npx expo start -c
   ```
3. **GestureHandler 必须在最外层**: 确保 `GestureHandlerRootView` 包裹整个应用

## 最佳实践

1. **使用 BottomSheetScrollView**: 替代普通 ScrollView，自动处理滚动和键盘
2. **设置合理的 snapPoints**: 根据内容高度设置停靠点
3. **添加背景遮罩**: 提升用户体验
4. **底部留白**: 在内容底部添加足够的留白，避免被键盘遮挡

## 参考资料
- [官方文档](https://gorhom.github.io/react-native-bottom-sheet/)
- [示例代码](https://github.com/gorhom/react-native-bottom-sheet/tree/master/example)
