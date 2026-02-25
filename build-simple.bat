@echo off
echo ========================================
echo 简化版 Android 构建
echo ========================================
echo.

echo 设置环境变量...
set JAVA_HOME=D:\java JDK
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\12724\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo 检查环境...
java -version
echo.
adb devices
echo.

echo 开始构建（这可能需要 5-10 分钟）...
echo 如果长时间没有输出，按 Ctrl+C 停止并重试
echo.

cd android
call gradlew assembleDebug --no-daemon --info
cd ..

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo ========================================
    echo.
    echo APK 位置: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 正在安装到设备...
    adb install -r android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 完成！现在可以启动开发服务器:
    echo npm run start:dev
) else (
    echo.
    echo ========================================
    echo ❌ 构建失败
    echo ========================================
    echo.
    echo 请查看上面的错误信息
)

pause
