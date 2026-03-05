# Android Release 签名配置问题报告

## 问题确认

✅ **已确认：当前 APK 是 DEBUG 版本**

### 证据：
1. APK 签名证书 DN 字段全部为空：`CN=, OU=, O=, L=, ST=, C=`
2. 这是 Android Debug 默认证书的典型特征

## 根本原因

检查 `android/app/build.gradle` 发现：

```groovy
buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
    release {
        // ⚠️ 问题在这里！Release 版本使用了 debug 签名
        signingConfig signingConfigs.debug  // ❌ 错误配置
        minifyEnabled enableMinifyInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

**问题：** Release 构建类型使用了 `signingConfigs.debug`，导致即使打包 Release 版本，也会使用 debug.keystore 签名。

## 当前状态

- ✅ 存在 `android/app/debug.keystore`
- ❌ 不存在 `android/app/release.keystore` 或其他正式签名文件
- ❌ Release 构建配置指向 debug 签名

## 解决方案

### 方案 1：生成并配置 Release Keystore（推荐）

#### 步骤 1：生成 Release Keystore

```bash
cd android/app

keytool -genkeypair -v -storetype PKCS12 \
  -keystore release.keystore \
  -alias qa-app-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass 你的密码 \
  -keypass 你的密码 \
  -dname "CN=你的公司名, OU=你的部门, O=你的组织, L=你的城市, ST=你的省份, C=你的国家代码"
```

**参数说明：**
- `release.keystore`: 密钥库文件名
- `qa-app-release`: 密钥别名
- `你的密码`: 设置一个强密码（至少6位）
- `dname`: 证书信息（例如：CN=QA Hero, OU=Mobile, O=QA Company, L=Beijing, ST=Beijing, C=CN）
- `validity 10000`: 有效期约27年

#### 步骤 2：创建密钥配置文件

在 `android/` 目录下创建 `keystore.properties` 文件：

```properties
storePassword=你的密码
keyPassword=你的密码
keyAlias=qa-app-release
storeFile=release.keystore
```

**⚠️ 重要：** 将 `keystore.properties` 添加到 `.gitignore`，不要提交到版本控制！

#### 步骤 3：修改 build.gradle

修改 `android/app/build.gradle`：

```groovy
android {
    // ... 其他配置

    // 在 android 块的开头添加
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
            signingConfig signingConfigs.release  // ✅ 改为使用 release 签名
            minifyEnabled enableMinifyInReleaseBuilds
            shrinkResources enableShrinkResources.toBoolean()
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 步骤 4：更新 .gitignore

确保 `android/.gitignore` 包含：

```
# Keystore files
*.keystore
!debug.keystore
keystore.properties
```

#### 步骤 5：重新打包 Release 版本

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

生成的 APK 位置：`android/app/build/outputs/apk/release/app-release.apk`

### 方案 2：使用 Expo 构建服务（简单但需要 Expo 账号）

如果你使用 Expo，可以使用 EAS Build：

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置构建
eas build:configure

# 构建 Android Release
eas build --platform android --profile production
```

## 验证 Release 版本

打包完成后，验证签名：

```bash
# Windows PowerShell
& "$env:ANDROID_HOME\build-tools\35.0.0\apksigner.bat" verify --print-certs "android\app\build\outputs\apk\release\app-release.apk"
```

**正确的 Release 版本应该显示：**
```
Signer #1 certificate DN: CN=你的公司名, OU=你的部门, O=你的组织, L=你的城市, ST=你的省份, C=你的国家代码
```

而不是全部为空。

## 重要提醒

1. **保管好 release.keystore 文件**
   - 这是你应用的唯一签名，丢失后无法更新应用
   - 建议备份到安全的地方（加密云存储、密码管理器等）

2. **不要泄露密码**
   - 不要将 keystore.properties 提交到 Git
   - 不要在代码中硬编码密码

3. **版本号管理**
   - 每次发布新版本，记得更新 `versionCode` 和 `versionName`
   - 当前配置：`versionCode 1`, `versionName "1.0.0"`

4. **Google Play 要求**
   - 如果要上传到 Google Play，必须使用 Release 签名
   - 首次上传后，后续更新必须使用相同的签名

## 下一步行动

1. ✅ 生成 release.keystore
2. ✅ 创建 keystore.properties
3. ✅ 修改 build.gradle
4. ✅ 更新 .gitignore
5. ✅ 重新打包并验证
6. ✅ 备份 keystore 文件

需要我帮你执行这些步骤吗？
