@echo off
echo ========================================
echo 修复 Java 环境变量
echo ========================================
echo.

echo 正在设置 JAVA_HOME...
setx JAVA_HOME "D:\java JDK"

echo 正在添加到 PATH...
setx PATH "%PATH%;D:\java JDK\bin"

echo.
echo ========================================
echo ✅ 设置完成！
echo ========================================
echo.
echo 重要提示:
echo 1. 关闭所有 PowerShell 窗口
echo 2. 重新打开 PowerShell
echo 3. 运行: java -version
echo 4. 如果成功，运行: npx expo run:android
echo.
pause
