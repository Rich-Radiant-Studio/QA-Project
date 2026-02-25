# 快速开始调试

## 🚀 一键启动

### Windows

双击运行：
```
start-debug.bat
```

或在终端中运行：
```bash
npm run start:dev:tunnel
```

### Mac/Linux

```bash
npm run start:dev:tunnel
```

## 📱 连接设备

1. **启动服务器后会显示二维码**
2. **打开已安装的 Development Build 应用**（不是 Expo Go！）
3. **扫描二维码**
4. **等待应用加载**

## 🐛 调试头像上传

### 测试步骤

1. 进入"我的"页面
2. 点击头像
3. 选择"拍照"或"从相册选择"
4. 授予权限（首次）
5. 选择/拍摄照片
6. 观察控制台日志

### 查看日志

终端会显示：

```
📊 图片大小: 2.34 MB
🔄 转换图片为 Base64...
📊 Base64 长度: 3145728
📤 上传头像中...
📥 上传响应: { code: 200, ... }
✅ 头像上传成功
🖼️ 新头像路径: https://...
```

## ⚠️ 注意事项

1. **必须使用 Development Build**，不能使用 Expo Go
2. **首次启动需要等待 10-30 秒**建立隧道
3. **确保已安装 expo-file-system**
4. **确保已重新构建应用**

## 🔧 如果遇到问题

### 问题 1: 找不到 Development Build 应用

**解决**: 重新构建应用
```bash
npx expo run:android  # 或 npx expo run:ios
```

### 问题 2: Tunnel 启动失败

**解决**: 使用 LAN 模式
```bash
npm run start:dev
```

### 问题 3: 图片上传失败

**解决**: 查看 `DEBUG_WITH_TUNNEL.md` 详细调试指南

## 📚 详细文档

- `DEBUG_WITH_TUNNEL.md` - 完整调试指南
- `AVATAR_UPLOAD_FINAL_SUMMARY.md` - 功能实现总结
- `AVATAR_UPLOAD_TEST_GUIDE.md` - 测试指南

---

**开始调试！** 🎉
