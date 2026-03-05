# 快速构建 Android Release 版本

## 🚀 三步构建

### 1️⃣ 生成签名文件（首次）

```powershell
.\scripts\generate-keystore.ps1
```

按提示输入信息，记住密码！

### 2️⃣ 构建 APK

```powershell
.\scripts\build-android.ps1
```

### 3️⃣ 获取 APK

APK 位置：`android\app\build\outputs\apk\release\app-release.apk`

---

## 📝 详细说明

查看完整指南：`Android本地构建完整指南.md`

## ⚠️ 重要提醒

1. **备份 keystore 文件**：`android/app/release.keystore`
2. **记住密码**：丢失后无法恢复
3. **不要提交到 Git**：已自动添加到 .gitignore

## 🔍 验证签名

```powershell
& "$env:ANDROID_HOME\build-tools\35.0.0\apksigner.bat" verify --print-certs android\app\build\outputs\apk\release\app-release.apk
```

应该显示你的公司/组织信息，而不是空白。

## 📱 安装测试

```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

## 🎯 下次构建

已经生成过 keystore 后，直接运行：

```powershell
.\scripts\build-android.ps1
```

就这么简单！
