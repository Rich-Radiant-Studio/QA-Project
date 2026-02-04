# QA Native App - 公网访问指南

## 📱 二维码访问

二维码图片已生成：`expo-public-qrcode.png`

## 🌐 公网访问地址

```
exp://atllyxa-anonymous-8081.exp.direct
```

## 📲 使用方法

### 方法一：扫描二维码（推荐）

1. 在手机上安装 **Expo Go** 应用
   - iOS: 在 App Store 搜索 "Expo Go"
   - Android: 在 Google Play 或应用商店搜索 "Expo Go"

2. 打开 Expo Go 应用

3. 扫描 `expo-public-qrcode.png` 二维码

4. 应用会自动加载并运行

### 方法二：手动输入地址

1. 打开 Expo Go 应用

2. 点击 "Enter URL manually"（手动输入URL）

3. 输入地址：`exp://atllyxa-anonymous-8081.exp.direct`

4. 点击连接

## ⚠️ 注意事项

1. **保持开发服务器运行**
   - 确保本地的 Expo 开发服务器一直在运行
   - 不要关闭终端窗口

2. **网络要求**
   - 手机需要连接到互联网
   - 使用 tunnel 模式，手机和电脑不需要在同一网络

3. **首次加载**
   - 首次加载可能需要较长时间
   - 请耐心等待应用下载和编译

4. **调试**
   - 可以在终端中看到应用的日志输出
   - 摇晃手机可以打开开发者菜单

## 🔧 重新生成二维码

如果需要重新生成二维码，运行：

```bash
node save-qrcode.js
```

## 🛑 停止服务器

按 `Ctrl+C` 停止 Expo 开发服务器

## 📝 当前状态

- ✅ Expo 服务器已启动
- ✅ Tunnel 模式已连接
- ✅ 二维码已生成
- ✅ 公网访问已就绪

## 🎯 功能说明

本应用是一个问答社区移动端应用，包含以下功能：

- 首页问题浏览
- 问题详情查看
- 回答和评论
- 补充问题
- 团队协作
- 活动管理
- 个人中心
- 消息通知

祝您使用愉快！🎉
