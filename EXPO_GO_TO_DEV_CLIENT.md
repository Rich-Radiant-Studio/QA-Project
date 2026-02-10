# Expo Go 转 Development Build 说明

## 转换日期
2026-02-10

## 转换原因
项目需要使用特殊的原生功能，Expo Go 无法满足需求。

## 转换方式
使用 EAS Build 构建 Development Build

## 转换步骤

### 1. 备份代码
```bash
git add .
git commit -m "转换前备份"
git tag v1.0-expo-go
git push origin v1.0-expo-go
```

### 2. 安装 EAS CLI（如果还没有）
```bash
npm install -g eas-cli
```

### 3. 登录 EAS（使用公司账号）
```bash
eas login
```

### 4. 构建 Development Build

**Android（推荐先构建）：**
```bash
eas build --profile development --platform android
```

**iOS（需要 Apple 开发者账号）：**
```bash
eas build --profile development --platform ios
```

### 5. 安装到设备
构建完成后，EAS 会提供下载链接：
- Android：直接下载 APK 安装
- iOS：通过 TestFlight 或直接安装

### 6. 启动开发服务器
```bash
npx expo start --dev-client
```

### 7. 在 Development Build 中打开
- 不再使用 Expo Go
- 使用刚安装的 Development Build APP
- 扫码或输入 URL 连接

## 开发流程变化

### 之前（Expo Go）
```bash
npx expo start
# 在 Expo Go 中扫码
```

### 之后（Development Build）
```bash
npx expo start --dev-client
# 在 Development Build 中扫码
```

## 注意事项

1. **账号管理**
   - 使用公司的 Expo 账号
   - 使用公司的 Apple 开发者账号
   - 使用公司的 Google Play 账号

2. **构建频率**
   - 只有添加新的原生依赖时才需要重新构建
   - 修改 JS 代码不需要重新构建
   - 免费额度：30 次/月

3. **团队协作**
   - 构建好的 APP 可以分享给团队
   - 所有人使用同一个 Development Build
   - 只需要一个人构建，其他人下载安装

4. **成本**
   - EAS Build 免费额度：30 次/月
   - 如果不够用：$29/月（公司承担）
   - Apple 开发者账号：$99/年（公司承担）

## 回滚方案

如果转换后遇到问题，可以回滚：
```bash
git checkout v1.0-expo-go
```

## 相关文档
- [EAS Build 文档](https://docs.expo.dev/build/introduction/)
- [Development Build 文档](https://docs.expo.dev/develop/development-builds/introduction/)
