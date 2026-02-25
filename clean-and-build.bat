@echo off
echo ========================================
echo 清理并构建 Android
echo ========================================
echo.

echo [1/4] 设置 Java 环境变量...
set JAVA_HOME=D:\java JDK
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
echo.

echo [2/4] 清理 Gradle 缓存...
cd android
call gradlew clean
cd ..
echo.

echo [3/4] 清理 Gradle 锁文件...
del /F /Q "%USERPROFILE%\.gradle\caches\*.lock" 2>nul
del /F /Q "%USERPROFILE%\.gradle\wrapper\dists\*\*.lck" 2>nul
echo.

echo [4/4] 开始构建...
npx expo run:android

pause
