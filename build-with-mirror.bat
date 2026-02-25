@echo off
echo ========================================
echo 使用国内镜像构建 Android
echo ========================================
echo.

echo 设置环境变量...
set JAVA_HOME=D:\javaJDK
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\12724\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo 已配置国内镜像:
echo - Gradle: 腾讯云镜像
echo - Maven: 阿里云镜像
echo.

echo 开始构建...
cd android
call gradlew assembleDebug --no-daemon
cd ..

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo ========================================
    echo.
    adb install -r android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 完成！启动开发服务器: npm run start:dev
) else (
    echo.
    echo ========================================
    echo ❌ 构建失败
    echo ========================================
)

pause
