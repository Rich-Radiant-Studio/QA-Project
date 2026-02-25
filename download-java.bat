@echo off
echo ========================================
echo 下载 Java JDK 17
echo ========================================
echo.
echo 正在打开下载页面...
echo.
echo 请下载 Windows x64 MSI 安装包
echo 安装时请勾选:
echo   ✓ Set JAVA_HOME variable
echo   ✓ Add to PATH
echo.
start https://adoptium.net/temurin/releases/?version=17
echo.
echo 下载并安装完成后:
echo 1. 关闭所有 PowerShell 窗口
echo 2. 重新打开 PowerShell
echo 3. 运行: java -version (验证)
echo 4. 运行: npx expo run:android (继续构建)
echo.
pause
