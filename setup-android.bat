@echo off
echo ========================================
echo Android 本地构建 - 首次设置
echo ========================================
echo.
echo 此脚本将帮助你完成 Android 本地构建的设置
echo.
pause

echo.
echo [步骤 1/3] 检查 Android Studio...
echo.
where adb >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Android Studio 已安装
    adb version
) else (
    echo ❌ 未检测到 Android Studio
    echo.
    echo 请先安装 Android Studio:
    echo https://developer.android.com/studio
    echo.
    echo 安装完成后，请配置环境变量 ANDROID_HOME
    echo 详细步骤请查看: SETUP_LOCAL_ANDROID.md
    pause
    exit /b 1
)

echo.
echo [步骤 2/3] 生成原生项目...
echo.
call npx expo prebuild
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 生成失败
    pause
    exit /b 1
)

echo.
echo [步骤 3/3] 首次构建 Android...
echo.
echo 这可能需要 5-10 分钟，请耐心等待...
echo.
call npx expo run:android
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 构建失败
    echo.
    echo 常见问题:
    echo 1. 确保 Android 设备已连接或模拟器已启动
    echo 2. 运行 'adb devices' 检查设备
    echo 3. 查看 SETUP_LOCAL_ANDROID.md 获取帮助
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 设置完成！
echo ========================================
echo.
echo 下一步:
echo 1. 启动开发服务器: npm run start:dev
echo 2. 在 APP 中扫码连接
echo 3. 开始开发！
echo.
echo 详细指南: HYBRID_BUILD_GUIDE.md
echo.
pause
