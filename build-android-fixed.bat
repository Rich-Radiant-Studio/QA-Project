@echo off
echo ========================================
echo Android 本地构建 (修复版)
echo ========================================
echo.

echo 设置环境变量...
set "JAVA_HOME=D:\javaJDK"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\12724\AppData\Local\Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"

echo.
echo 验证环境...
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.

echo 检查 Java 版本...
java -version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Java 未正确配置
    pause
    exit /b 1
)

echo.
echo 检查 Android SDK...
if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ❌ Android SDK 未找到
    pause
    exit /b 1
)

echo.
echo ========================================
echo 开始构建 Android APK...
echo ========================================
echo.

cd android
if %ERRORLEVEL% NEQ 0 (
    echo ❌ android 目录不存在
    cd ..
    pause
    exit /b 1
)

echo 清理旧的构建...
call gradlew clean --no-daemon
echo.

echo 开始构建 Debug APK...
call gradlew assembleDebug --no-daemon --stacktrace
set BUILD_RESULT=%ERRORLEVEL%

cd ..

if %BUILD_RESULT% EQU 0 (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo ========================================
    echo.
    
    set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk
    
    if exist "%APK_PATH%" (
        echo APK 位置: %APK_PATH%
        echo.
        
        echo 检查设备连接...
        adb devices
        echo.
        
        set /p INSTALL="是否安装到设备？(y/n): "
        if /i "%INSTALL%"=="y" (
            echo 安装中...
            adb install -r "%APK_PATH%"
            if %ERRORLEVEL% EQU 0 (
                echo ✅ 安装成功！
            ) else (
                echo ❌ 安装失败
            )
        )
    ) else (
        echo ❌ APK 文件未找到: %APK_PATH%
    )
) else (
    echo.
    echo ========================================
    echo ❌ 构建失败 (错误代码: %BUILD_RESULT%)
    echo ========================================
    echo.
    echo 请检查上面的错误信息
)

echo.
pause
