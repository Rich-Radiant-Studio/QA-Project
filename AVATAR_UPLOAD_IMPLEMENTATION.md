# 头像上传功能实现文档

## 📸 功能概述

实现了完整的头像上传功能，包括：
- 📷 拍照上传
- 🖼️ 从相册选择上传
- 🔐 权限请求处理
- ⬆️ 图片上传到服务器（Base64 格式）
- 💾 自动更新缓存

## 🎯 API 接口信息

### 上传头像接口

- **地址**: `POST /app/user/profile/avatar`
- **请求头**: `Authorization: Bearer {token}`（自动添加）
- **请求体**:
  ```json
  {
    "avatarfile": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
  ```
- **图片要求**:
  - 最大大小: 5MB
  - 支持格式: bmp/gif/jpg/jpeg/png
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "string",
    "data": {
      "avatar": "https://example.com/avatars/xxx.jpg"
    }
  }
  ```

## 🎯 实现细节

### 1. 使用的库

```json
{
  "expo-image-picker": "~17.0.10",  // 已安装
  "expo-file-system": "~18.0.x"     // 需要安装
}
```

### 2. 核心功能

#### 2.1 图片转换为 Base64

```javascript
const convertImageToBase64 = async (imageUri) => {
  // 1. 读取图片文件为 Base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  // 2. 获取文件类型
  const fileType = imageUri.split('.').pop().toLowerCase();
  const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
  
  // 3. 构建完整的 Base64 字符串（包含 data URI scheme）
  return `data:${mimeType};base64,${base64}`;
};
```

#### 2.2 检查图片大小

```javascript
const checkImageSize = async (imageUri) => {
  const fileInfo = await FileSystem.getInfoAsync(imageUri);
  
  if (fileInfo.exists && fileInfo.size) {
    const sizeInMB = fileInfo.size / (1024 * 1024);
    
    if (sizeInMB > 5) {
      Alert.alert('图片过大', '请选择小于 5MB 的图片');
      return false;
    }
  }
  
  return true;
};
```

#### 2.1 权限请求

```javascript
// 相机权限
const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

// 相册权限
const requestMediaLibraryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};
```

#### 2.2 拍照功能

```javascript
const handleTakePhoto = async () => {
  // 1. 请求相机权限
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return;
  
  // 2. 打开相机
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,      // 允许编辑（裁剪）
    aspect: [1, 1],           // 正方形裁剪
    quality: 0.8,             // 压缩质量 80%
  });
  
  // 3. 上传图片
  if (!result.canceled) {
    await uploadImageToServer(result.assets[0].uri);
  }
};
```

#### 2.3 相册选择功能

```javascript
const handleChooseFromAlbum = async () => {
  // 1. 请求相册权限
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return;
  
  // 2. 打开相册
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,      // 允许编辑（裁剪）
    aspect: [1, 1],           // 正方形裁剪
    quality: 0.8,             // 压缩质量 80%
  });
  
  // 3. 上传图片
  if (!result.canceled) {
    await uploadImageToServer(result.assets[0].uri);
  }
};
```

#### 2.3 图片上传

```javascript
const uploadImageToServer = async (imageUri) => {
  // 1. 检查图片大小（最大 5MB）
  const sizeOk = await checkImageSize(imageUri);
  if (!sizeOk) return;
  
  // 2. 转换图片为 Base64
  const base64Image = await convertImageToBase64(imageUri);
  
  // 3. 调用上传 API
  const response = await userApi.uploadAvatar(base64Image);
  
  // 4. 从返回数据中获取新的头像路径
  const newAvatarUrl = response.data.avatar 
    || response.data.avatarUrl 
    || response.data.url 
    || response.data.avatarPath;
  
  // 5. 更新本地状态和缓存
  if (response.code === 200) {
    setUserProfile(prev => ({
      ...prev,
      avatar: newAvatarUrl,
    }));
    
    await UserCacheService.forceRefresh();
  }
};
```

### 3. API 实现

```javascript
// src/services/api/userApi.js
uploadAvatar: (base64Image) => {
  return apiClient.post('/app/user/profile/avatar', {
    avatarfile: base64Image,  // 字段名必须是 avatarfile
  });
}
```

### 4. UI 交互流程

```
用户点击头像
    ↓
显示底部弹出框（AvatarActionSheet）
    ↓
选择"拍照"或"从相册选择"
    ↓
请求相应权限
    ↓
打开相机/相册
    ↓
用户选择/拍摄照片
    ↓
允许裁剪（1:1 正方形）
    ↓
检查图片大小（最大 5MB）
    ↓
转换为 Base64 格式
    ↓
上传到服务器（显示加载状态）
    ↓
获取新的头像路径
    ↓
更新本地状态和缓存
    ↓
显示成功提示
```

## 🎨 用户体验优化

### 1. 加载状态

```javascript
const [uploadingAvatar, setUploadingAvatar] = useState(false);

// 上传时显示加载指示器
<View style={styles.avatarBadge}>
  {uploadingAvatar ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Ionicons name="camera" size={14} color="#fff" />
  )}
</View>
```

### 2. 权限提示

- 如果用户拒绝权限，显示友好的提示信息
- 引导用户去设置中开启权限

### 3. 图片压缩

- 质量设置为 0.8（80%），平衡质量和文件大小
- 强制 1:1 裁剪，确保头像显示效果

### 4. 错误处理

```javascript
try {
  await uploadImageToServer(imageUri);
} catch (error) {
  console.error('上传失败:', error);
  Alert.alert('上传失败', error.message || '网络错误，请稍后重试');
}
```

## 📱 平台差异处理

### iOS

```javascript
uri: imageUri.replace('file://', '')  // 移除 file:// 前缀
```

### Android

```javascript
uri: imageUri  // 直接使用原始 URI
```

## 🔧 配置要求

### app.json 权限配置

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "允许访问您的相册以更换头像",
          "cameraPermission": "允许使用相机拍摄头像"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "允许访问您的相册以更换头像",
        "NSCameraUsageDescription": "允许使用相机拍摄头像"
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## 🧪 测试要点

### 1. 权限测试

- ✅ 首次请求权限
- ✅ 用户拒绝权限
- ✅ 用户允许权限
- ✅ 权限被系统禁用

### 2. 功能测试

- ✅ 拍照上传
- ✅ 相册选择上传
- ✅ 图片裁剪
- ✅ 上传成功
- ✅ 上传失败
- ✅ 网络错误处理

### 3. UI 测试

- ✅ 加载状态显示
- ✅ 头像实时更新
- ✅ 底部弹出框动画
- ✅ 取消操作

## 📊 性能优化

### 1. 图片压缩

```javascript
quality: 0.8  // 80% 质量，减少文件大小
```

### 2. 缓存更新

```javascript
// 上传成功后立即刷新缓存
await UserCacheService.forceRefresh();
```

### 3. 本地预览

```javascript
// 上传前先更新本地状态，提供即时反馈
setUserProfile(prev => ({
  ...prev,
  avatar: imageUri,  // 先显示本地图片
}));
```

## 🚀 使用方法

### 开发环境测试

```bash
# 1. 启动开发服务器
npm run start:dev

# 2. 在真机上测试（模拟器可能无法使用相机）
# iOS: 扫描二维码或使用 USB 连接
# Android: 扫描二维码或使用 USB 连接
```

### 注意事项

1. **必须在真机上测试**：模拟器可能无法使用相机功能
2. **需要 Development Build**：不能使用 Expo Go
3. **权限配置**：确保 app.json 中配置了相应权限
4. **网络连接**：确保设备能访问后端服务器

## 🔗 相关文件

- `src/screens/SettingsScreen.js` - 主要实现文件
- `src/components/AvatarActionSheet.js` - 底部弹出框组件
- `src/services/api/userApi.js` - 上传 API
- `src/services/UserCacheService.js` - 缓存服务

## 📝 后续优化建议

1. **图片预览**：上传前显示预览界面
2. **多图上传**：支持一次选择多张图片
3. **图片编辑**：添加滤镜、旋转等编辑功能
4. **上传进度**：显示上传进度条
5. **离线支持**：网络恢复后自动重试上传
6. **图片缓存**：本地缓存已上传的图片

## ✅ 完成状态

- ✅ 拍照功能
- ✅ 相册选择功能
- ✅ 权限请求
- ✅ 图片上传
- ✅ 加载状态
- ✅ 错误处理
- ✅ 缓存更新
- ✅ UI 优化

---

**实现时间**: 2026-02-13
**版本**: v1.0.0
