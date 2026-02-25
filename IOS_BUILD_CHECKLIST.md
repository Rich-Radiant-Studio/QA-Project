# iOS 构建准备清单

## ✅ 必需准备（构建前）

### 1. Apple Developer 账号
- [ ] 注册 Apple Developer 账号
- [ ] 支付年费（$99 个人 / $299 企业）
- [ ] 登录地址：https://developer.apple.com/

### 2. Bundle Identifier
- [x] 已在 app.json 中配置：`com.qa.app`
- [ ] 在 Apple Developer Console 创建对应的 App ID

### 3. Apple Developer Console 配置

**步骤：**
1. 登录 https://developer.apple.com/account/
2. 进入 "Certificates, Identifiers & Profiles"
3. 创建 App ID：
   - 点击 "Identifiers" → "+" 按钮
   - 选择 "App IDs"
   - Description: Problem to Hero
   - Bundle ID: `com.qa.app`（必须与 app.json 一致）
   - 勾选需要的 Capabilities：
     - [x] Push Notifications（推送通知）
     - [x] Maps（地图）
     - [x] Apple Pay（支付，如果用）

## 📱 Development Build 额外需要

### 4. 注册测试设备 UDID

**获取 UDID 方式：**

**方法 1：通过 Finder（macOS Catalina+）**
1. 连接 iPhone 到 Mac
2. 打开 Finder
3. 选择设备
4. 点击设备名称下方的信息，会显示 UDID

**方法 2：通过 iTunes（Windows/旧版 macOS）**
1. 连接 iPhone 到电脑
2. 打开 iTunes
3. 点击设备图标
4. 点击"序列号"，会切换显示 UDID

**方法 3：在设备上查看**
1. 设置 → 通用 → 关于本机
2. 找到"标识符"或"UDID"

**注册 UDID：**
1. 在 Apple Developer Console
2. 进入 "Devices"
3. 点击 "+" 添加设备
4. 输入设备名称和 UDID

### 5. EAS Build 会自动处理

- ✅ 自动生成 Provisioning Profile
- ✅ 自动生成证书
- ✅ 自动签名

## 🔧 app.json 完整配置

当前配置已基本完成，但建议添加：

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.qa.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "UIViewControllerBasedStatusBarAppearance": false,
        "NSLocationWhenInUseUsageDescription": "We need your location to show nearby services",
        "NSCameraUsageDescription": "We need camera access to take photos"
      },
      "config": {
        "googleMapsApiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

## 🚀 构建命令

### Development Build（开发版）
```bash
npx eas build --profile development --platform ios
```

### Production Build（生产版）
```bash
npx eas build --profile production --platform ios
```

## 📊 构建流程

1. **运行构建命令**
2. **EAS 会询问：**
   - 是否生成新的 Provisioning Profile？→ 选择 Yes
   - 是否登录 Apple Developer 账号？→ 输入账号密码
3. **等待构建**（25-35 分钟）
4. **下载 IPA 文件**

## 📱 安装方式

### Development Build
- **方法 1**：扫描 QR 码（需要先注册设备 UDID）
- **方法 2**：通过 TestFlight
- **方法 3**：使用 Apple Configurator（需要 Mac）

### Production Build
- 通过 TestFlight 分发
- 或提交到 App Store

## ⚠️ 常见问题

### 1. "No valid code signing identity found"
- 需要在 Apple Developer Console 创建证书
- EAS Build 可以自动处理

### 2. "Device not registered"
- 需要在 Apple Developer Console 注册设备 UDID
- Development Build 必需

### 3. "Bundle Identifier already exists"
- 需要使用唯一的 Bundle Identifier
- 或者使用已有的 App ID

## 💰 费用说明

### Apple Developer 账号
- **个人账号**：$99/年
- **企业账号**：$299/年

### EAS Build 配额
- **免费**：30 次/月
- **已使用**：1 次（Android）
- **剩余**：29 次

### 预估使用
- iOS Development Build：1 次
- iOS Production Build：1-2 次
- **总计**：2-3 次

## 📝 准备步骤总结

**最少需要：**
1. ✅ Apple Developer 账号（$99/年）
2. ✅ Bundle Identifier 已配置
3. ✅ 在 Apple Developer Console 创建 App ID
4. ⏳ 注册测试设备 UDID（Development Build 必需）

**可选：**
- Google Maps API Key（如果用地图）
- Stripe 配置（如果用支付）

## 🎯 下一步

1. **注册 Apple Developer 账号**
2. **创建 App ID**（使用 `com.qa.app`）
3. **注册测试设备 UDID**
4. **运行构建命令**

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 EAS Build 文档：https://docs.expo.dev/build/introduction/
2. 查看 Apple Developer 文档：https://developer.apple.com/documentation/
3. Expo Discord 社区：https://chat.expo.dev/

---

**准备好后，运行 `eas-build-ios.bat` 开始构建！**
