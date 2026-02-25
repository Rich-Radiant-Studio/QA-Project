@echo off
echo ========================================
echo 环境诊断工具
echo ========================================
echo.

echo [1] 检查 JAVA_HOME...
set "JAVA_HOME=D:\javaJDK"
echo JAVA_HOME = %JAVA_HOME%

if exist "%JAVA_HOME%\bin\java.exe" (
    echo ✅ Java 可执行文件存在
) else (
    echo ❌ Java 可执行文件不存在
    echo 路径: %JAVA_HOME%\bin\java.exe
)
echo.

echo [2] 测试 Java 命令...
set "PATH=%JAVA_HOME%\bin;%PATH%"
java -version 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Java 命令可用
) else (
    echo ❌ Java 命令失败
)
echo.

echo [3] 检查 ANDROID_HOME...
set "ANDROID_HOME=C:\Users\12724\AppData\Local\Android\Sdk"
echo ANDROID_HOME = %ANDROID_HOME%

if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ✅ Android SDK 存在
) else (
    echo ❌ Android SDK 不存在
    echo 路径: %ANDROID_HOME%\platform-tools\adb.exe
)
echo.

echo [4] 检查 android 目录...
if exist "android" (
    echo ✅ android 目录存在
    if exist "android\gradlew.bat" (
        echo ✅ gradlew.bat 存在
    ) else (
        echo ❌ gradlew.bat 不存在
    )
) else (
    echo ❌ android 目录不存在
)
echo.

echo [5] 检查 Gradle wrapper...
if exist "android\gradle\wrapper\gradle-wrapper.jar" (
    echo ✅ gradle-wrapper.jar 存在
) else (
    echo ❌ gradle-wrapper.jar 不存在
)
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
pause
