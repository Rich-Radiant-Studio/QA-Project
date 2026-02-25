@echo off
echo ========================================
echo Android 本地构建
echo ========================================
echo.
echo 正在构建 Android Development Build...
echo.

npx expo run:android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo ========================================
    echo.
    echo 下一步:
    echo 1. 启动开发服务器: npm run start:dev
    echo 2. 在 APP 中扫码连接
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ 构建失败
    echo ========================================
    echo.
    echo 故障排除:
    echo 1. 检查设备连接: adb devices
    echo 2. 清理缓存: npx expo start --clear
    echo 3. 重新生成: npx expo prebuild --clean
    echo 4. 查看详细日志
    echo.
)

pause
