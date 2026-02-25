# 头像上传验证说明

## 📋 API 接口信息

**接口地址**：`/app/user/profile/avatar`

**请求方式**：POST (multipart/form-data)

**参数**：
- `avatarfile`: 图片文件

**限制**：
- 最大文件大小：5MB
- 支持格式：BMP、GIF、JPG、JPEG、PNG

**返回**：
- 成功：返回新头像 URL
- 失败：返回错误信息

## ✅ 已实施的验证

### 1. 文件大小验证

```javascript
// 检查文件大小（最大 5MB）
const sizeInMB = blob.size / (1024 * 1024);

if (sizeInMB > 5) {
  return {
    valid: false,
    error: '图片大小超过 5MB，请选择更小的图片',
  };
}
```

**效果**：
- ✅ 上传前检查文件大小
- ✅ 超过 5MB 时显示友好提示
- ✅ 避免上传大文件浪费流量

### 2. 文件格式验证

#### 方式 1：检查 MIME 类型

```javascript
const fileType = blob.type.toLowerCase();
const allowedTypes = ['image/bmp', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png'];

if (!allowedTypes.includes(fileType)) {
  return {
    valid: false,
    error: '不支持的图片格式，请选择 BMP、GIF、JPG、JPEG 或 PNG 格式的图片',
  };
}
```

#### 方式 2：检查文件扩展名

```javascript
const fileName = imageUri.split('/').pop().toLowerCase();
const validExtensions = ['.bmp', '.gif', '.jpg', '.jpeg', '.png'];
const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

if (!hasValidExtension) {
  return {
    valid: false,
    error: '不支持的文件扩展名，请选择 .bmp、.gif、.jpg、.jpeg 或 .png 文件',
  };
}
```

**效果**：
- ✅ 双重验证（MIME 类型 + 文件扩展名）
- ✅ 拒绝不支持的格式
- ✅ 显示明确的错误提示

### 3. 图片质量压缩

```javascript
// ImagePicker 配置
const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.8, // 压缩质量 80%
});
```

**效果**：
- ✅ 自动压缩图片
- ✅ 减小文件大小
- ✅ 提高上传速度

## 🔍 验证流程

### 用户选择图片
```
用户点击"更换头像"
  ↓
选择"拍照"或"从相册选择"
  ↓
ImagePicker 返回图片 URI
  ↓
调用 validateImage(imageUri)
```

### 验证步骤

```
1. 使用 fetch 获取图片数据
   ↓
2. 检查文件大小
   ├─ 超过 5MB → 显示错误，停止上传
   └─ 小于等于 5MB → 继续
   ↓
3. 检查 MIME 类型
   ├─ 不在允许列表 → 显示错误，停止上传
   └─ 在允许列表 → 继续
   ↓
4. 检查文件扩展名
   ├─ 不在允许列表 → 显示错误，停止上传
   └─ 在允许列表 → 继续
   ↓
5. 验证通过
   ↓
6. 调用 uploadAvatar API
   ↓
7. 显示上传结果
```

## 📊 验证结果示例

### 成功示例

```javascript
{
  valid: true,
  fileInfo: {
    size: 1048576,           // 字节
    sizeInMB: '1.00',        // MB
    type: 'image/jpeg',      // MIME 类型
    fileName: 'avatar.jpg',  // 文件名
  }
}
```

**日志输出**：
```
✅ 图片验证通过:
   文件名: avatar.jpg
   大小: 1.00 MB
   类型: image/jpeg
```

### 失败示例 1：文件过大

```javascript
{
  valid: false,
  error: '图片大小超过 5MB，请选择更小的图片'
}
```

**用户看到**：Toast 提示 "图片大小超过 5MB，请选择更小的图片"

### 失败示例 2：格式不支持

```javascript
{
  valid: false,
  error: '不支持的图片格式，请选择 BMP、GIF、JPG、JPEG 或 PNG 格式的图片'
}
```

**用户看到**：Toast 提示 "不支持的图片格式，请选择 BMP、GIF、JPG、JPEG 或 PNG 格式的图片"

## 🎯 支持的格式详情

| 格式 | MIME 类型 | 文件扩展名 | 说明 |
|------|-----------|-----------|------|
| BMP | image/bmp | .bmp | 位图格式，文件较大 |
| GIF | image/gif | .gif | 支持动画，文件较小 |
| JPG | image/jpg | .jpg | 常用格式，有损压缩 |
| JPEG | image/jpeg | .jpeg | 与 JPG 相同 |
| PNG | image/png | .png | 无损压缩，支持透明 |

## 🚫 不支持的格式

以下格式会被拒绝：
- ❌ WEBP (image/webp)
- ❌ SVG (image/svg+xml)
- ❌ TIFF (image/tiff)
- ❌ ICO (image/x-icon)
- ❌ HEIC/HEIF (image/heic, image/heif)
- ❌ 其他非图片格式

## 💡 用户提示

### 文件过大时的建议

当用户选择的图片超过 5MB 时，显示以下提示：

```
图片大小超过 5MB，请选择更小的图片

建议：
1. 使用手机相册的编辑功能压缩图片
2. 选择分辨率较低的图片
3. 使用图片压缩工具
```

### 格式不支持时的建议

当用户选择的图片格式不支持时，显示以下提示：

```
不支持的图片格式

支持的格式：
- BMP (.bmp)
- GIF (.gif)
- JPG/JPEG (.jpg, .jpeg)
- PNG (.png)

请使用上述格式的图片
```

## 🔧 代码位置

### 验证函数
- 文件：`src/screens/SettingsScreen.js`
- 函数：`validateImage(imageUri)`

### 上传函数
- 文件：`src/screens/SettingsScreen.js`
- 函数：`uploadImageToServer(imageUri)`

### API 调用
- 文件：`src/services/api/userApi.js`
- 函数：`uploadAvatar(imageUri)`

## 📝 测试场景

### 场景 1：正常上传
1. 选择一张 2MB 的 JPG 图片
2. 验证通过
3. 上传成功
4. 显示新头像

### 场景 2：文件过大
1. 选择一张 8MB 的 PNG 图片
2. 验证失败：文件过大
3. 显示错误提示
4. 不发起上传请求

### 场景 3：格式不支持
1. 选择一张 WEBP 格式的图片
2. 验证失败：格式不支持
3. 显示错误提示
4. 不发起上传请求

### 场景 4：网络错误
1. 选择一张 1MB 的 JPG 图片
2. 验证通过
3. 上传失败（网络错误）
4. 显示网络错误提示

## 🎉 优势

1. **用户体验好**
   - 上传前验证，避免浪费时间
   - 明确的错误提示
   - 自动压缩图片

2. **节省流量**
   - 拒绝过大的文件
   - 压缩图片质量
   - 减少无效上传

3. **安全性高**
   - 限制文件格式
   - 限制文件大小
   - 双重验证机制

4. **易于维护**
   - 验证逻辑集中
   - 代码清晰易读
   - 便于扩展

## 🔄 未来优化

### 可选优化 1：图片裁剪
```javascript
const result = await ImagePicker.launchImageLibraryAsync({
  allowsEditing: true,  // 启用裁剪
  aspect: [1, 1],       // 正方形
});
```

### 可选优化 2：图片预览
在上传前显示图片预览，让用户确认。

### 可选优化 3：进度显示
显示上传进度条，提升用户体验。

### 可选优化 4：智能压缩
根据图片大小自动调整压缩质量：
- 小于 1MB：quality = 0.9
- 1-3MB：quality = 0.8
- 3-5MB：quality = 0.7

## 📚 相关文档

- `AVATAR_UPLOAD_IMPLEMENTATION.md` - 头像上传实现文档
- `AVATAR_FIX_COMPLETED.md` - 头像功能修复记录
- `API_USAGE_GUIDE.md` - API 使用指南
