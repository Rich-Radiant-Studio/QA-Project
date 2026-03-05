# Android 本地构建脚本

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("debug", "release")]
    [string]$BuildType = "release",
    
    [Parameter(Mandatory=$false)]
    [switch]$Clean = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android 本地构建工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在项目根目录
if (-not (Test-Path "android/app/build.gradle")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查 Release 构建的签名配置
if ($BuildType -eq "release") {
    if (-not (Test-Path "android/keystore.properties")) {
        Write-Host "❌ 错误: 未找到 android/keystore.properties" -ForegroundColor Red
        Write-Host "请先运行: .\scripts\generate-keystore.ps1" -ForegroundColor Yellow
        exit 1
    }
    
    if (-not (Test-Path "android/app/release.keystore")) {
        Write-Host "❌ 错误: 未找到 android/app/release.keystore" -ForegroundColor Red
        Write-Host "请先运行: .\scripts\generate-keystore.ps1" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ 签名配置检查通过" -ForegroundColor Green
}

# 清理构建
if ($Clean) {
    Write-Host ""
    Write-Host "🧹 清理旧的构建文件..." -ForegroundColor Yellow
    Push-Location android
    & .\gradlew clean
    Pop-Location
    Write-Host "✅ 清理完成" -ForegroundColor Green
}

# 开始构建
Write-Host ""
Write-Host "🔨 开始构建 Android $BuildType 版本..." -ForegroundColor Cyan
Write-Host ""

Push-Location android

if ($BuildType -eq "debug") {
    & .\gradlew assembleDebug
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
} else {
    & .\gradlew assembleRelease
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
}

Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ 构建成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $fullApkPath = "android\$apkPath"
    
    if (Test-Path $fullApkPath) {
        $fileInfo = Get-Item $fullApkPath
        $fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        
        Write-Host "APK 文件信息：" -ForegroundColor Cyan
        Write-Host "  路径: $fullApkPath" -ForegroundColor Yellow
        Write-Host "  大小: $fileSizeMB MB" -ForegroundColor Yellow
        Write-Host "  修改时间: $($fileInfo.LastWriteTime)" -ForegroundColor Yellow
        Write-Host ""
        
        # 验证签名
        if ($BuildType -eq "release") {
            Write-Host "验证 APK 签名..." -ForegroundColor Cyan
            & "$env:ANDROID_HOME\build-tools\35.0.0\apksigner.bat" verify --print-certs $fullApkPath 2>&1 | Select-Object -First 5
            Write-Host ""
        }
        
        # 询问是否安装到设备
        Write-Host "是否安装到连接的设备? (yes/no)" -ForegroundColor Yellow
        $install = Read-Host
        
        if ($install -eq "yes") {
            Write-Host ""
            Write-Host "📱 安装到设备..." -ForegroundColor Cyan
            & adb install -r $fullApkPath
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ 安装成功！" -ForegroundColor Green
            } else {
                Write-Host "❌ 安装失败" -ForegroundColor Red
            }
        }
        
    } else {
        Write-Host "⚠️  警告: 未找到 APK 文件" -ForegroundColor Yellow
    }
    
} else {
    Write-Host ""
    Write-Host "❌ 构建失败！" -ForegroundColor Red
    Write-Host "请检查上面的错误信息" -ForegroundColor Yellow
    exit 1
}
