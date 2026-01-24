# 📱 QA Native App - 公网访问二维码

## ✅ 二维码已生成

### 📁 文件列表

1. **expo-qrcode.png** (3,078 字节)
   - 标准尺寸：500x500 像素
   - 适合手机屏幕查看

2. **expo-public-qrcode.png** (5,118 字节) ⭐ 推荐
   - 大尺寸：800x800 像素
   - 适合打印和分享
   - 扫描更清晰

3. **qrcode-page.html** (5,757 字节)
   - 精美的网页展示页面
   - 包含完整使用说明
   - 可直接在浏览器中打开

---

## 🌐 公网访问地址

```
exp://atllyxa-anonymous-8081.exp.direct
```

---

## 📱 使用方法

### 方式一：扫描二维码（推荐）

1. **在手机上安装 Expo Go**
   - Android: [Google Play 下载](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store 下载](https://apps.apple.com/app/expo-go/id982107779)

2. **打开二维码图片**
   - 打开 `expo-public-qrcode.png`（推荐）
   - 或打开 `qrcode-page.html` 在浏览器中查看

3. **扫描二维码**
   - 打开 Expo Go 应用
   - 点击 "Scan QR Code"
   - 扫描二维码

4. **开始使用**
   - 应用会自动加载
   - 首次加载可能需要几秒钟

### 方式二：手动输入 URL

1. 打开 Expo Go 应用
2. 在输入框中输入：`exp://atllyxa-anonymous-8081.exp.direct`
3. 点击连接

---

## 🎯 分享方式

### 1. 微信/QQ 分享
- 直接发送 `expo-public-qrcode.png` 图片
- 对方扫描即可访问

### 2. 邮件分享
- 附件：`expo-public-qrcode.png`
- 或附件：`qrcode-page.html`（更专业）

### 3. 打印分享
- 打开 `qrcode-page.html`
- 使用浏览器打印功能
- 打印出来分发

### 4. 网页展示
- 将 `qrcode-page.html` 和 `expo-public-qrcode.png` 上传到服务器
- 通过网页链接分享

---

## ✨ 应用特性

- ✅ **公网可访问** - 任何人都可以扫码访问
- ✅ **实时更新** - 代码修改后自动刷新
- ✅ **跨平台** - 支持 iOS 和 Android
- ✅ **原生体验** - 完整的原生应用功能
- ✅ **头像修复** - 已修复所有头像显示问题

---

## 🔧 开发服务器状态

**状态：** ✅ 运行中

**启动命令：**
```bash
cd qa-app/qa-native-app
npm start -- --tunnel
```

**停止服务：**
- 在运行服务器的终端按 `Ctrl+C`

**重新生成二维码：**
```bash
node generate-qrcode.js          # 生成标准尺寸
node generate-large-qrcode.js    # 生成大尺寸
```

---

## 📊 技术信息

| 项目 | 信息 |
|------|------|
| 框架 | React Native + Expo |
| 访问方式 | Expo Tunnel（公网） |
| 端口 | 8081 |
| 协议 | exp:// |
| 二维码库 | qrcode (Node.js) |

---

## 🆘 常见问题

### Q: 扫码后无法加载？
A: 
1. 确保手机已安装 Expo Go
2. 检查手机网络连接
3. 确认开发服务器正在运行
4. 尝试重新扫码

### Q: 加载很慢？
A: 
1. 首次加载需要下载资源，请耐心等待
2. 确保网络连接稳定
3. 后续访问会更快

### Q: 显示错误？
A: 
1. 检查服务器终端是否有错误信息
2. 尝试在服务器终端按 `r` 重新加载
3. 重启开发服务器

### Q: 二维码过期了？
A: 
1. 每次重启服务器，URL 可能会变化
2. 重新运行 `node generate-large-qrcode.js`
3. 使用新生成的二维码

---

## 📞 技术支持

如遇问题，请检查：
1. 开发服务器是否正常运行
2. 手机是否已安装 Expo Go
3. 网络连接是否正常
4. 二维码是否清晰完整

---

## 📝 更新日志

**2026-01-24**
- ✅ 生成公网访问二维码
- ✅ 创建大尺寸二维码（800x800）
- ✅ 创建精美的 HTML 展示页面
- ✅ 完善使用文档

---

**生成时间：** 2026-01-24 11:47
**文档版本：** 1.0.0
