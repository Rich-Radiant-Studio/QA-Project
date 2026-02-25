@echo off
echo ========================================
echo 安装所有必需的原生库
echo ========================================
echo.

echo [1/8] 安装底部抽屉...
call npm install @gorhom/bottom-sheet

echo.
echo [2/8] 安装地图...
call npm install react-native-maps

echo.
echo [3/8] 安装定位...
call npx expo install expo-location

echo.
echo [4/8] 安装支付（Stripe）...
call npm install @stripe/stripe-react-native

echo.
echo [5/8] 安装网络状态检测...
call npm install @react-native-community/netinfo

echo.
echo [6/8] 安装相机（可选）...
call npx expo install expo-camera

echo.
echo [7/8] 安装设备信息（Expo内置）...
call npx expo install expo-constants expo-device

echo.
echo [8/8] 安装详细设备信息（可选）...
set /p INSTALL_DEVICE_INFO="是否安装 react-native-device-info？(y/n): "
if /i "%INSTALL_DEVICE_INFO%"=="y" (
    call npm install react-native-device-info
    echo ✅ 已安装 react-native-device-info
) else (
    echo ⏭️  跳过 react-native-device-info（使用 Expo 内置即可）
)

echo.
echo ========================================
echo ✅ 所有库安装完成！
echo ========================================
echo.
echo 已安装的库：
echo   - @gorhom/bottom-sheet （底部抽屉）
echo   - react-native-maps （地图）
echo   - expo-location （定位）
echo   - @stripe/stripe-react-native （支付）
echo   - @react-native-community/netinfo （网络状态）
echo   - expo-camera （相机）
echo   - expo-constants + expo-device （设备信息）
echo.
echo 下一步：运行 EAS Build 或本地构建
echo   EAS Build: npx eas build --profile development --platform android
echo   本地构建: build.bat
echo.
pause
