# Android 本地构建完整指南

## 构建策略

- **Android**: 本地构建（快速、灵活、免费）
- **iOS**: 使用 EAS Build（需要 Mac 或云构建服务）

## 前置要求

### 1. 安装必要工具

- ✅ Node.js (已安装)
- ✅ Android Studio / Android SDK (已安装)
- ✅ JDK 17+ (已安装)

### 2. 环境变量

确保已配置：
```powershell
$env:ANDROID_HOME  # 应该指向 Android SDK 目录
$env:JAVA_HOME     # 应该指向 JDK 目录
```

验证：
```powershell
$env:ANDROID_HOME
$env:JAVA_HOME
```

## 步骤 1：生成 Release Keystore

### 方式 A：使用脚本（推荐）

```powershell
# 在项目根目录运行
.\scripts\generate-keystore.ps1
```

按提示输入：
- 密钥库密码（至少6位，请记住）
- 密钥密码（可以与密钥库密码相同）
- 公司/组织名称（如：QA Hero）
- 其他信息（可选）

脚本会自动：
1. 生成 `android/app/release.keystore`
2. 创建 `android/keystore.properties` 配置文件
3. 验证 keystore 信息

### 方式 B：手动生成

```powershell
cd android/app

keytool -genkeypair -v `
  -storetype PKCS12 `
  -keystore release.keystore `
  -alias qa-app-release `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -storepass 你的密码 `
  -keypass 你的密码 `
  -dname "CN=QA Hero, OU=Mobile, O=QA Company, L=Beijing, ST=Beijing, C=CN"
```

然后手动创建 `android/keystore.properties`：
```properties
storePassword=你的密码
keyPassword=你的密码
keyAlias=qa-app-release
storeFile=release.keystore
```

## 步骤 2：配置 build.gradle

检查 `android/app/build.gradle` 是否已配置签名（应该已经配置好了）：

```gradle
android {
    // 读取签名配置
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    def keystoreProperties = new Properties()
    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release  // ✅ 使用 release 签名
            minifyEnabled enableMinifyInReleaseBuilds
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

## 步骤 3：构建 APK

### 方式 A：使用脚本（推荐）

```powershell
# 构建 Release 版本
.\scripts\build-android.ps1

# 构建 Debug 版本
.\scripts\build-android.ps1 -BuildType debug

# 清理后构建
.\scripts\build-android.ps1 -Clean
```

### 方式 B：使用 Gradle 命令

```powershell
cd android

# 构建 Release APK
.\gradlew assembleRelease

# 构建 Debug APK
.\gradlew assembleDebug

# 清理后构建
.\gradlew clean assembleRelease
```

### 方式 C：使用 npm 脚本

在 `package.json` 中添加：
```json
{
  "scripts": {
    "android:build": "cd android && gradlew assembleRelease",
    "android:build:debug": "cd android && gradlew assembleDebug",
    "android:clean": "cd android && gradlew clean"
  }
}
```

然后运行：
```powershell
npm run android:build
```

## 步骤 4：验证 APK

### 检查签名

```powershell
& "$env:ANDROID_HOME\build-tools\35.0.0\apksigner.bat" verify --print-certs android\app\build\outputs\apk\release\app-release.apk
```

**正确的 Release 版本应该显示：**
```
Signer #1 certificate DN: CN=QA Hero, OU=Mobile, O=QA Company, L=Beijing, ST=Beijing, C=CN
```

**错误的 Debug 版本会显示：**
```
Signer #1 certificate DN: CN=, OU=, O=, L=, ST=, C=
```

### 检查 APK 信息

```powershell
& "$env:ANDROID_HOME\build-tools\35.0.0\aapt.exe" dump badging android\app\build\outputs\apk\release\app-release.apk | Select-String "package:|versionCode|versionName"
```

## 步骤 5：安装测试

### 安装到连接的设备

```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

### 查看连接的设备

```powershell
adb devices
```

## 构建产物位置

```
android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk          # Debug 版本
└── release/
    └── app-release.apk        # Release 版本（用于发布）
```

## 版本管理

### 更新版本号

编辑 `android/app/build.gradle`：

```gradle
defaultConfig {
    applicationId 'com.qa.app'
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2              // ← 每次发布递增
    versionName "1.0.1"        // ← 版本名称
}
```

**规则：**
- `versionCode`: 整数，每次发布必须递增（1, 2, 3, ...）
- `versionName`: 字符串，语义化版本（1.0.0, 1.0.1, 1.1.0, ...）

## 构建优化

### 减小 APK 体积

在 `android/app/build.gradle` 中：

```gradle
android {
    buildTypes {
        release {
            // 启用代码压缩
            minifyEnabled true
            // 启用资源压缩
            shrinkResources true
            // ProGuard 规则
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
    
    // 只构建需要的架构
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk true
        }
    }
}
```

### 加速构建

在 `android/gradle.properties` 中：

```properties
# 启用并行构建
org.gradle.parallel=true
# 启用构建缓存
org.gradle.caching=true
# 增加内存
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

## 常见问题

### 1. 构建失败：找不到 keystore

**错误：**
```
Execution failed for task ':app:validateSigningRelease'.
> Keystore file not found
```

**解决：**
```powershell
# 检查文件是否存在
Test-Path android/app/release.keystore
Test-Path android/keystore.properties

# 重新生成
.\scripts\generate-keystore.ps1
```

### 2. 签名验证失败

**错误：**
```
ERROR: Failed to verify signature
```

**解决：**
- 检查密码是否正确
- 重新生成 keystore
- 确保 build.gradle 配置正确

### 3. 内存不足

**错误：**
```
OutOfMemoryError: Java heap space
```

**解决：**
编辑 `android/gradle.properties`：
```properties
org.gradle.jvmargs=-Xmx4096m
```

### 4. 构建速度慢

**优化：**
1. 启用 Gradle 守护进程
2. 使用本地 Maven 缓存
3. 减少不必要的依赖
4. 使用增量构建

## 发布到应用商店

### Google Play

1. 登录 [Google Play Console](https://play.google.com/console)
2. 创建应用
3. 上传 `app-release.apk`
4. 填写应用信息
5. 提交审核

### 其他应用商店

- 华为应用市场
- 小米应用商店
- OPPO 软件商店
- vivo 应用商店
- 应用宝（腾讯）

## 备份重要文件

**必须备份：**
- ✅ `android/app/release.keystore` - 签名文件（最重要！）
- ✅ `android/keystore.properties` - 签名配置
- ✅ 密码记录（写在安全的地方）

**备份位置建议：**
- 加密的云存储（如 1Password、LastPass）
- 加密的 U 盘
- 公司的安全服务器

**⚠️ 警告：**
- 丢失 keystore 后无法更新应用
- 只能重新发布新应用（会丢失所有用户）

## iOS 构建（使用 EAS）

iOS 构建将使用 EAS Build 服务：

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置构建
eas build:configure

# 构建 iOS
eas build --platform ios --profile production
```

详细的 iOS 构建指南将在需要时提供。

## 总结

### Android 本地构建流程

1. ✅ 生成 keystore: `.\scripts\generate-keystore.ps1`
2. ✅ 构建 APK: `.\scripts\build-android.ps1`
3. ✅ 验证签名: `apksigner verify`
4. ✅ 安装测试: `adb install`
5. ✅ 发布到应用商店

### 优势

- ✅ 快速构建（本地）
- ✅ 完全控制
- ✅ 免费
- ✅ 易于调试
- ✅ 支持自动化

### 下一步

- [ ] 生成 release.keystore
- [ ] 配置 build.gradle
- [ ] 构建第一个 Release APK
- [ ] 验证签名
- [ ] 准备发布到应用商店
