@echo off
echo ========================================
echo Android 构建
echo ========================================
echo.

set JAVA_HOME=D:\javaJDK
set ANDROID_HOME=C:\Users\12724\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%

cd android
call gradlew assembleDebug --no-daemon
set BUILD_RESULT=%ERRORLEVEL%
cd ..

if %BUILD_RESULT% EQU 0 (
    echo.
    echo ✅ 构建成功！
    echo.
    set APK=android\app\build\outputs\apk\debug\app-debug.apk
    if exist "%APK%" (
        echo APK: %APK%
        echo.
        adb devices
        echo.
        set /p INSTALL="安装到设备？(y/n): "
        if /i "%INSTALL%"=="y" adb install -r "%APK%"
    )
) else (
    echo.
    echo ❌ 构建失败
)

pause
