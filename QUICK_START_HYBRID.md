# 快速开始 - 混合构建方案

## 🎯 目标

- Android：本地构建（免费、快速）
- iOS：EAS Build（云端构建）

## 📋 前提条件检查

- [ ] Windows 系统
- [ ] 已安装 Node.js
- [ ] 已有 Expo 公司账号
- [ ] 已安装 Android Studio（如果还没有，看下面）

## 🚀 快速开始

### 选项 A：使用自动化脚本（推荐）

```bash
# 1. 首次设置（只需一次）
setup-android.bat

# 2. 之后的构建
build-android.bat  # Android
build-ios.bat      # iOS
```

### 选项 B：手动操作

#### 步骤 1：安装 Android Studio

1. 下载：https://developer.android.com/studio
2. 安装（选择 Standard 安装）
3. 配置环境变量（详见 `SETUP_LOCAL_ANDROID.md`）

#### 步骤 2：安装 EAS CLI

```bash
npm install -g eas-cli
```

#### 步骤 3：登录公司账号

```bash
eas login
# 输入公司的 Expo 账号和密码
```

#### 步骤 4：生成原生项目

```bash
npx expo prebuild
```

#### 步骤 5：构建 Android

```bash
# 方式 A：使用 npm 脚本
npm run android

# 方式 B：直接运行
npx expo run:android
```

#### 步骤 6：构建 iOS（需要时）

```bash
# 方式 A：使用 npm 脚本
npm run ios:build:dev

# 方式 B：直接运行
eas build --profile development --platform ios
```

## 📱 日常开发流程

### 1. 启动开发服务器

```bash
npm run start:dev
```

### 2. 修改代码

编辑 `src/` 目录下的文件，代码会自动热更新。

### 3. 何时需要重新构建？

**需要重新构建：**
- ✅ 添加了新的原生库
- ✅ 修改了原生代码
- ✅ 修改了 app.json 的某些配置

**不需要重新构建：**
- ❌ 修改 JS/JSX 代码
- ❌ 修改样式
- ❌ 修改业务逻辑

## 🔧 常用命令

```bash
# 开发服务器
npm run start:dev          # 启动 Development Build 服务器
npm run start:tunnel       # 启动 Tunnel 模式（Expo Go）

# Android
npm run android            # 本地构建 Android
npm run android:clean      # 清理 Android 构建

# iOS
npm run ios:build:dev      # 构建 iOS Development Build
npm run ios:build:prod     # 构建 iOS Production Build

# 原生项目
npm run prebuild           # 生成原生项目
npm run prebuild:clean     # 重新生成原生项目

# 其他
npm run build:status       # 查看 EAS 构建状态
npm test                   # 运行测试
```

## 📊 构建次数管理

### 免费额度

- EAS Build：30 次/月
- Android 本地构建：无限次

### 典型消耗

**开发阶段（1个月）：**
```
Android 本地构建：无限次（不消耗 EAS）
iOS 云端构建：2-5 次

总消耗：2-5 次 / 30 次
剩余：25-28 次
```

**发布阶段：**
```
Android：本地构建（不消耗）
iOS：2-3 次

总消耗：2-3 次
```

## ⚠️ 注意事项

### 1. 不要提交原生项目到 Git

`.gitignore` 已配置：
```
android/
ios/
```

### 2. 保持环境一致

确保团队使用相同的：
- Node.js 版本
- npm/yarn 版本
- Expo SDK 版本

### 3. 优先测试 Android

先在 Android 上测试功能，确认无误后再构建 iOS。

## 🆘 故障排除

### Android 构建失败

```bash
# 1. 检查设备
adb devices

# 2. 清理缓存
npx expo start --clear

# 3. 重新生成
npx expo prebuild --clean

# 4. 重新构建
npm run android
```

### iOS 构建失败

```bash
# 1. 检查登录
eas whoami

# 2. 重新登录
eas logout
eas login

# 3. 清理缓存重新构建
eas build --profile development --platform ios --clear-cache
```

### 环境变量问题

```bash
# 检查 ANDROID_HOME
echo %ANDROID_HOME%

# 应该显示类似：
# C:\Users\你的用户名\AppData\Local\Android\Sdk
```

## 📚 详细文档

- `SETUP_LOCAL_ANDROID.md` - Android Studio 安装和配置
- `HYBRID_BUILD_GUIDE.md` - 混合构建完整指南
- `TUNNEL_MODE_GUIDE.md` - Tunnel 模式使用指南

## ✅ 成功标志

当你看到：

**Android：**
```
✅ BUILD SUCCESSFUL
✅ Installing APK
✅ Starting Metro Bundler
```

**iOS：**
```
✅ Build finished
✅ Download: https://expo.dev/artifacts/...
```

## 🎉 下一步

1. 开始开发功能
2. 定期测试 iOS
3. 准备发布

**祝开发顺利！** 🚀
