# Development Client + Tunnel 调试指南

## 🚀 快速启动

### 方法 1: 使用 npm 脚本（推荐）

```bash
npm run start:dev:tunnel
```

### 方法 2: 直接使用 expo 命令

```bash
npx expo start --dev-client --tunnel
```

## 📱 连接设备

### 启动后会显示：

```
› Metro waiting on exp://xxx.xxx.xxx.xxx:8081
› Tunnel ready.
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 连接步骤：

1. **确保手机和电脑在同一网络**（Tunnel 模式下不需要，但建议）
2. **打开已安装的 Development Build 应用**
3. **扫描二维码**
4. **等待应用加载**

## 🔧 Tunnel 模式说明

### 什么是 Tunnel 模式？

Tunnel 模式通过 Expo 的服务器创建一个公网隧道，让你的设备可以通过互联网访问开发服务器。

### 优点：

- ✅ 不需要手机和电脑在同一网络
- ✅ 可以在任何地方调试
- ✅ 可以分享给其他人测试
- ✅ 绕过防火墙和网络限制

### 缺点：

- ⚠️ 首次启动较慢（需要建立隧道）
- ⚠️ 网络延迟可能较高
- ⚠️ 依赖 Expo 服务器

## 🐛 调试头像上传功能

### 1. 启动服务器

```bash
npm run start:dev:tunnel
```

### 2. 打开应用

- 扫描二维码
- 或按 `a` 打开 Android 设备
- 或按 `i` 打开 iOS 模拟器

### 3. 测试步骤

1. 进入"我的"页面
2. 点击头像
3. 选择"拍照"或"从相册选择"
4. 授予权限（首次）
5. 选择/拍摄照片
6. 裁剪照片
7. 观察上传过程

### 4. 查看日志

在终端中会显示：

```
🔄 转换图片为 Base64...
📊 Base64 长度: 123456
📤 上传头像中...
📥 上传响应: { code: 200, data: { avatar: "..." } }
✅ 头像上传成功
🖼️ 新头像路径: https://...
```

### 5. 常见问题排查

#### 问题 1: 图片过大

```
❌ 图片过大，请选择小于 5MB 的图片
```

**解决**: 选择较小的图片或降低拍照质量

#### 问题 2: 转换失败

```
❌ 转换图片为 Base64 失败
```

**解决**: 
- 检查是否安装了 expo-file-system
- 重新构建应用

#### 问题 3: 上传失败

```
❌ 上传头像失败: Network Error
```

**解决**:
- 检查网络连接
- 检查后端服务器是否运行
- 检查 Token 是否有效

#### 问题 4: 权限被拒绝

```
❌ 需要相机权限
```

**解决**:
- 在设备设置中授予权限
- 重新启动应用

## 📊 调试技巧

### 1. 查看详细日志

在 `src/screens/SettingsScreen.js` 中已经添加了详细的日志：

```javascript
console.log('📊 图片大小:', sizeInMB.toFixed(2), 'MB');
console.log('🔄 转换图片为 Base64...');
console.log('📊 Base64 长度:', base64Image.length);
console.log('📤 上传头像中...');
console.log('📥 上传响应:', response);
console.log('✅ 头像上传成功');
console.log('🖼️ 新头像路径:', newAvatarUrl);
```

### 2. 使用 React Native Debugger

```bash
# 在应用中按 Ctrl+M (Android) 或 Cmd+D (iOS)
# 选择 "Debug"
```

### 3. 查看网络请求

在 `src/services/api/apiClient.js` 中查看请求和响应：

```javascript
console.log('Request:', config);
console.log('Response:', response);
```

### 4. 测试不同场景

- [ ] 拍照上传（小图片）
- [ ] 拍照上传（大图片 > 5MB）
- [ ] 相册选择（JPG）
- [ ] 相册选择（PNG）
- [ ] 相册选择（GIF）
- [ ] 网络断开时上传
- [ ] Token 过期时上传

## 🔄 重新加载应用

### 方法 1: 在终端中

按 `r` 键重新加载应用

### 方法 2: 在设备上

- Android: 摇晃设备或按 Ctrl+M，选择 "Reload"
- iOS: 摇晃设备或按 Cmd+D，选择 "Reload"

### 方法 3: 快速刷新

修改代码后会自动刷新（Fast Refresh）

## 🛠️ 常用命令

```bash
# 启动 Development Client + Tunnel
npm run start:dev:tunnel

# 清除缓存并启动
npx expo start --dev-client --tunnel --clear

# 重新构建应用
npx expo run:android  # 或 npx expo run:ios

# 查看日志
npx expo start --dev-client --tunnel --verbose
```

## 📱 设备要求

### Android

- Android 5.0 (API 21) 或更高版本
- 已安装 Development Build 应用
- 相机和存储权限

### iOS

- iOS 13.0 或更高版本
- 已安装 Development Build 应用
- 相机和相册权限

## 🌐 网络要求

### Tunnel 模式

- 需要互联网连接
- 不需要手机和电脑在同一网络
- 首次启动需要等待隧道建立（10-30秒）

### LAN 模式（备选）

如果 Tunnel 模式太慢，可以使用 LAN 模式：

```bash
npm run start:dev
```

## 🔍 故障排除

### 问题 1: Tunnel 启动失败

```
Error: Could not create tunnel
```

**解决**:
```bash
# 1. 检查网络连接
# 2. 重试
npm run start:dev:tunnel

# 3. 如果还是失败，使用 LAN 模式
npm run start:dev
```

### 问题 2: 无法连接到服务器

```
Error: Unable to connect to development server
```

**解决**:
1. 确保应用是 Development Build（不是 Expo Go）
2. 重新扫描二维码
3. 重启应用
4. 重启服务器

### 问题 3: 应用崩溃

**解决**:
1. 查看终端日志
2. 查看设备日志
3. 重新构建应用
4. 清除缓存

### 问题 4: 图片上传失败

**解决**:
1. 检查网络连接
2. 查看控制台日志
3. 检查后端服务器
4. 检查 Token 是否有效

## 📝 调试清单

### 启动前检查

- [ ] 已安装 expo-file-system
- [ ] 已重新构建应用
- [ ] 设备已安装 Development Build
- [ ] 网络连接正常

### 测试检查

- [ ] 拍照功能正常
- [ ] 相册选择功能正常
- [ ] 图片大小检查正常
- [ ] Base64 转换正常
- [ ] 上传功能正常
- [ ] 头像更新正常
- [ ] 缓存刷新正常

### 日志检查

- [ ] 查看图片大小日志
- [ ] 查看 Base64 长度日志
- [ ] 查看上传请求日志
- [ ] 查看上传响应日志
- [ ] 查看错误日志

## 🎯 预期结果

### 成功场景

```
📊 图片大小: 2.34 MB
🔄 转换图片为 Base64...
📊 Base64 长度: 3145728
📤 上传头像中...
📥 上传响应: {
  code: 200,
  msg: "上传成功",
  data: {
    avatar: "https://example.com/avatars/xxx.jpg"
  }
}
✅ 头像上传成功
🖼️ 新头像路径: https://example.com/avatars/xxx.jpg
```

### 失败场景

```
❌ 上传头像失败: Request failed with status code 500
```

或

```
❌ 图片过大，请选择小于 5MB 的图片
```

## 📚 相关文档

- `AVATAR_UPLOAD_FINAL_SUMMARY.md` - 完整实现总结
- `AVATAR_UPLOAD_TEST_GUIDE.md` - 测试指南
- `AVATAR_UPLOAD_IMPLEMENTATION.md` - 实现文档

---

**调试愉快！** 🎉
