@echo off
echo ========================================
echo 配置 Java 环境
echo ========================================
echo.

echo 正在检查 Java...
java -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Java 已安装
    java -version
    goto :end
)

echo.
echo ❌ 未检测到 Java
echo.
echo 请选择安装方式:
echo 1. 自动下载安装 OpenJDK 17 (推荐)
echo 2. 手动安装
echo 3. 使用 Android Studio 自带的 JDK
echo.
set /p choice=请输入选项 (1-3): 

if "%choice%"=="1" goto auto
if "%choice%"=="2" goto manual
if "%choice%"=="3" goto android_jdk
goto end

:auto
echo.
echo 正在打开 OpenJDK 下载页面...
start https://adoptium.net/temurin/releases/?version=17
echo.
echo 请下载并安装 JDK 17
echo 安装完成后，重新运行此脚本
goto end

:manual
echo.
echo 手动安装步骤:
echo 1. 访问: https://adoptium.net/temurin/releases/?version=17
echo 2. 下载 Windows x64 MSI 安装包
echo 3. 运行安装程序
echo 4. 安装完成后，重新运行此脚本
goto end

:android_jdk
echo.
echo 查找 Android Studio 自带的 JDK...
set "ANDROID_STUDIO_JDK=C:\Program Files\Android\Android Studio\jbr"
if exist "%ANDROID_STUDIO_JDK%\bin\java.exe" (
    echo ✅ 找到 Android Studio JDK
    echo 路径: %ANDROID_STUDIO_JDK%
    echo.
    echo 设置环境变量...
    setx JAVA_HOME "%ANDROID_STUDIO_JDK%"
    set "PATH=%ANDROID_STUDIO_JDK%\bin;%PATH%"
    echo.
    echo ✅ 配置完成！
    echo 请关闭并重新打开命令行窗口
) else (
    echo ❌ 未找到 Android Studio JDK
    echo 请选择其他安装方式
)
goto end

:end
echo.
pause
