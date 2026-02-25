# Android 本地构建配置指南

## 前提条件

- ✅ Windows 系统
- ✅ 已有 Expo 公司账号
- ✅ 项目已配置好

## 步骤 1：安装 Android Studio

### 1.1 下载 Android Studio

访问：https://developer.android.com/studio

下载最新版本（推荐）

### 1.2 安装

1. 运行安装程序
2. 选择 "Standard" 安装类型
3. 等待下载 Android SDK 和其他组件
4. 完成安装

### 1.3 配置 Android SDK

1. 打开 Android Studio
2. 点击 "More Actions" → "SDK Manager"
3. 确保安装了：
   - ✅ Android SDK Platform 34（或最新版本）
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator（可选）
   - ✅ Android SDK Platform-Tools

## 步骤 2：配置环境变量

### 2.1 找到 Android SDK 路径

默认路径：
```
C:\Users\你的用户名\AppData\Local\Android\Sdk
```

### 2.2 设置环境变量

**方法 1：通过系统设置**

1. 右键 "此电脑" → "属性"
2. 点击 "高级系统设置"
3. 点击 "环境变量"
4. 在 "用户变量" 中点击 "新建"：
   - 变量名：`ANDROID_HOME`
   - 变量值：`C:\Users\你的用户名\AppData\Local\Android\Sdk`
5. 编辑 "Path" 变量，添加：
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

**方法 2：通过 PowerShell（临时）**

```powershell
$env:ANDROID_HOME = "C:\Users\你的用户名\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

### 2.3 验证安装

打开新的 PowerShell 窗口：

```bash
# 检查 adb
adb version

# 应该显示版本信息
```

## 步骤 3：生成原生项目

```bash
# 在项目根目录运行
npx expo prebuild
```

这会生成：
```
项目/
├── android/     # ← Android 原生项目
├── ios/         # ← iOS 原生项目（给 EAS Build 用）
├── src/
└── ...
```

## 步骤 4：首次构建

### 4.1 连接 Android 设备或启动模拟器

**选项 A：使用真机**

1. 在手机上启用"开发者选项"
2. 启用"USB 调试"
3. 用 USB 连接电脑
4. 验证连接：
   ```bash
   adb devices
   ```

**选项 B：使用模拟器**

1. 打开 Android Studio
2. 点击 "Device Manager"
3. 创建虚拟设备
4. 启动模拟器

### 4.2 运行构建

```bash
npx expo run:android
```

首次构建需要 5-10 分钟，请耐心等待。

## 步骤 5：日常开发

### 5.1 启动开发服务器

```bash
npx expo start --dev-client
```

### 5.2 修改代码

代码会自动热更新，不需要重新构建。

### 5.3 何时需要重新构建？

只有以下情况需要重新构建：

```bash
# 添加了新的原生库
npm install react-native-xxx
npx expo run:android

# 修改了原生代码
npx expo run:android

# 修改了 app.json 的某些配置
npx expo run:android
```

## 常见问题

### Q1: 找不到 ANDROID_HOME？

**A: 重新设置环境变量**

```bash
# 检查路径是否正确
dir "C:\Users\你的用户名\AppData\Local\Android\Sdk"

# 如果路径不对，找到正确的路径
# 在 Android Studio 中：Settings → Appearance & Behavior → System Settings → Android SDK
```

### Q2: adb 命令找不到？

**A: 添加到 Path**

```bash
# 临时添加
$env:Path += ";C:\Users\你的用户名\AppData\Local\Android\Sdk\platform-tools"

# 或永久添加到系统环境变量
```

### Q3: 构建失败？

**A: 清理并重试**

```bash
# 清理缓存
npx expo start --clear

# 重新生成原生项目
npx expo prebuild --clean

# 重新构建
npx expo run:android
```

### Q4: 模拟器启动失败？

**A: 检查虚拟化**

1. 确保 BIOS 中启用了虚拟化（VT-x 或 AMD-V）
2. 确保 Hyper-V 已启用（Windows 功能）
3. 重启电脑

### Q5: Gradle 下载慢？

**A: 配置国内镜像**

编辑 `android/build.gradle`：

```gradle
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public/' }
        maven { url 'https://maven.aliyun.com/repository/google/' }
        google()
        mavenCentral()
    }
}
```

## 成功标志

当你看到：

```
✅ BUILD SUCCESSFUL
✅ Installing APK
✅ Starting Metro Bundler
```

说明配置成功！

## 下一步

配置完成后，查看：
- `HYBRID_BUILD_GUIDE.md` - 混合构建指南（Android 本地 + iOS EAS）
- `DEVELOPMENT_WORKFLOW.md` - 日常开发流程
