# 现代化头像操作弹窗设计

## 🎨 设计理念

参考微信、QQ、小红书等主流 APP 的设计，采用现代化的底部弹出式操作面板。

## ✨ 设计特点

### 1. 底部弹出式设计
- ✅ 从底部滑出，符合用户操作习惯
- ✅ 半透明遮罩，突出操作面板
- ✅ 圆角设计，现代化视觉效果

### 2. 流畅的动画效果
- ✅ Spring 弹簧动画进入
- ✅ 平滑的退出动画
- ✅ 触摸反馈动画

### 3. 直观的图标设计
- ✅ 大尺寸彩色图标（64x64）
- ✅ 拍照：绿色相机图标
- ✅ 相册：蓝色图片图标
- ✅ 图标带阴影，增强层次感

### 4. 清晰的操作提示
- ✅ 顶部拖动指示器
- ✅ 标题"更换头像"
- ✅ 图标下方文字说明
- ✅ 底部取消按钮

## 📱 界面布局

```
┌─────────────────────────────────────┐
│         半透明遮罩（可点击关闭）        │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      ━━━  拖动指示器         │   │
│  │                             │   │
│  │        更换头像              │   │
│  │                             │   │
│  │   ┌─────┐      ┌─────┐     │   │
│  │   │ 📷  │      │ 🖼️  │     │   │
│  │   │相机 │      │相册 │     │   │
│  │   └─────┘      └─────┘     │   │
│  │    拍照      从相册选择      │   │
│  │                             │   │
│  │  ┌───────────────────────┐ │   │
│  │  │        取消           │ │   │
│  │  └───────────────────────┘ │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🎯 交互流程

### 用户操作流程

```
点击头像
    ↓
底部弹出操作面板（Spring 动画）
    ↓
用户选择操作：
    ├─ 点击"拍照" → 关闭面板 → 打开相机
    ├─ 点击"从相册选择" → 关闭面板 → 打开相册
    ├─ 点击"取消" → 关闭面板
    └─ 点击遮罩 → 关闭面板
```

### 动画时序

```
进入动画：
  - 遮罩淡入（Fade）
  - 面板从底部滑入（Spring）
  - 总时长：~300ms

退出动画：
  - 面板滑出到底部（Timing）
  - 遮罩淡出（Fade）
  - 总时长：~250ms
```

## 🎨 视觉设计

### 颜色方案

| 元素 | 颜色 | 说明 |
|------|------|------|
| 遮罩 | `rgba(0, 0, 0, 0.5)` | 半透明黑色 |
| 面板背景 | `#f8f9fa` | 浅灰色 |
| 拖动指示器 | `#d1d5db` | 灰色 |
| 标题文字 | `#1f2937` | 深灰色 |
| 拍照图标背景 | `#4CAF50` | 绿色 |
| 相册图标背景 | `#2196F3` | 蓝色 |
| 图标 | `#fff` | 白色 |
| 操作文字 | `#4b5563` | 中灰色 |
| 取消按钮背景 | `#fff` | 白色 |
| 取消按钮文字 | `#6b7280` | 灰色 |

### 尺寸规范

| 元素 | 尺寸 |
|------|------|
| 面板圆角 | 20px |
| 拖动指示器 | 40x4px |
| 图标容器 | 64x64px |
| 图标 | 24x24px |
| 标题字体 | 16px, 600 |
| 操作文字字体 | 14px, 500 |
| 取消按钮字体 | 16px, 500 |
| 取消按钮圆角 | 12px |

### 间距规范

| 位置 | 间距 |
|------|------|
| 面板顶部内边距 | 8px |
| 面板水平内边距 | 16px |
| 标题上下边距 | 12px |
| 操作区域上下边距 | 24px |
| 操作区域水平边距 | 20px |
| 图标与文字间距 | 12px |
| 取消按钮上边距 | 8px |
| 取消按钮下边距 | 12px |

## 📝 代码实现

### 组件文件

**文件：** `src/components/AvatarActionSheet.js`

**Props：**
```javascript
{
  visible: boolean,              // 是否显示
  onClose: () => void,           // 关闭回调
  onTakePhoto: () => void,       // 拍照回调
  onChooseFromAlbum: () => void, // 选择相册回调
}
```

**特性：**
- ✅ 使用 `Animated` 实现流畅动画
- ✅ 使用 `useSafeAreaInsets` 适配刘海屏
- ✅ 支持点击遮罩关闭
- ✅ 支持 Android 返回键关闭
- ✅ 自动处理动画时序

### 使用方法

```javascript
import AvatarActionSheet from '../components/AvatarActionSheet';

// 在组件中
const [showAvatarSheet, setShowAvatarSheet] = useState(false);

const handleTakePhoto = () => {
  // 打开相机
};

const handleChooseFromAlbum = () => {
  // 打开相册
};

// 渲染
<AvatarActionSheet
  visible={showAvatarSheet}
  onClose={() => setShowAvatarSheet(false)}
  onTakePhoto={handleTakePhoto}
  onChooseFromAlbum={handleChooseFromAlbum}
/>
```

## 🆚 对比旧设计

### 旧设计（Alert）

```
❌ 系统原生 Alert 弹窗
❌ 样式老旧，无法自定义
❌ 文字列表，不够直观
❌ 无动画效果
❌ 视觉效果差
```

### 新设计（ActionSheet）

```
✅ 底部弹出式设计
✅ 完全自定义样式
✅ 大图标 + 文字，直观易懂
✅ 流畅的动画效果
✅ 现代化视觉效果
```

## 📱 参考案例

### 微信
- 底部弹出式
- 大图标设计
- 简洁的文字说明
- 白色背景

### QQ
- 底部弹出式
- 彩色图标
- 圆角设计
- 阴影效果

### 小红书
- 底部弹出式
- 大尺寸图标
- 现代化配色
- 流畅动画

## 🎯 适配说明

### iOS 适配
- ✅ 使用 `useSafeAreaInsets` 适配刘海屏
- ✅ 底部安全区域自动适配
- ✅ 使用 iOS 风格的阴影

### Android 适配
- ✅ 使用 `elevation` 实现阴影
- ✅ 支持返回键关闭
- ✅ 状态栏透明处理

## 🔧 扩展功能

### 可以添加的功能

1. **查看大图**
   ```javascript
   <TouchableOpacity onPress={handleViewAvatar}>
     <View style={styles.iconContainer}>
       <Ionicons name="eye" size={24} color="#fff" />
     </View>
     <Text>查看大图</Text>
   </TouchableOpacity>
   ```

2. **删除头像**
   ```javascript
   <TouchableOpacity onPress={handleDeleteAvatar}>
     <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
       <Ionicons name="trash" size={24} color="#fff" />
     </View>
     <Text>删除头像</Text>
   </TouchableOpacity>
   ```

3. **从默认头像选择**
   ```javascript
   <TouchableOpacity onPress={handleChooseDefault}>
     <View style={[styles.iconContainer, { backgroundColor: '#f59e0b' }]}>
       <Ionicons name="person" size={24} color="#fff" />
     </View>
     <Text>默认头像</Text>
   </TouchableOpacity>
   ```

## 🚀 下一步

### 实现图片选择功能

需要安装 `expo-image-picker`：

```bash
npx expo install expo-image-picker
```

然后实现：

```javascript
import * as ImagePicker from 'expo-image-picker';

const handleTakePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('需要相机权限');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    // 上传头像
    uploadAvatar(result.assets[0].uri);
  }
};

const handleChooseFromAlbum = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('需要相册权限');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    // 上传头像
    uploadAvatar(result.assets[0].uri);
  }
};
```

## 📚 总结

通过现代化的底部弹出式设计，我们实现了：

- ✅ 更好的用户体验
- ✅ 更直观的操作方式
- ✅ 更现代的视觉效果
- ✅ 更流畅的动画效果
- ✅ 符合主流 APP 的设计规范

这是一个完整的、生产级别的头像操作组件！🎉
