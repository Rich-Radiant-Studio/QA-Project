# Android 本地构建脚本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android 本地构建" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置环境变量
$env:JAVA_HOME = "D:\javaJDK"
$env:ANDROID_HOME = "C:\Users\12724\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "环境配置:" -ForegroundColor Yellow
Write-Host "  JAVA_HOME: $env:JAVA_HOME"
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

# 验证 Java
Write-Host "检查 Java..." -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1
    Write-Host "✅ Java 已安装" -ForegroundColor Green
    Write-Host $javaVersion[0]
} catch {
    Write-Host "❌ Java 未正确配置" -ForegroundColor Red
    Read-Host "按 Enter 退出"
    exit 1
}

Write-Host ""

# 验证 Android SDK
Write-Host "检查 Android SDK..." -ForegroundColor Yellow
if (Test-Path "$env:ANDROID_HOME\platform-tools\adb.exe") {
    Write-Host "✅ Android SDK 已找到" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK 未找到" -ForegroundColor Red
    Read-Host "按 Enter 退出"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始构建..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 进入 android 目录
if (-not (Test-Path "android")) {
    Write-Host "❌ android 目录不存在" -ForegroundColor Red
    Read-Host "按 Enter 退出"
    exit 1
}

Set-Location android

# 清理
Write-Host "清理旧的构建..." -ForegroundColor Yellow
& .\gradlew clean --no-daemon
Write-Host ""

# 构建
Write-Host "构建 Debug APK..." -ForegroundColor Yellow
& .\gradlew assembleDebug --no-daemon --stacktrace
$buildResult = $LASTEXITCODE

Set-Location ..

if ($buildResult -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ 构建成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        Write-Host "APK 位置: $apkPath" -ForegroundColor Green
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK 大小: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "检查连接的设备..." -ForegroundColor Yellow
        & adb devices
        Write-Host ""
        
        $install = Read-Host "是否安装到设备？(y/n)"
        if ($install -eq "y" -or $install -eq "Y") {
            Write-Host "安装中..." -ForegroundColor Yellow
            & adb install -r $apkPath
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ 安装成功！" -ForegroundColor Green
            } else {
                Write-Host "❌ 安装失败" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ APK 文件未找到: $apkPath" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ 构建失败 (错误代码: $buildResult)" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查上面的错误信息" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "按 Enter 退出"
