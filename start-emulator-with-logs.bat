@echo off
echo ========================================
echo 启动服务器并打开日志查看器（模拟器模式）
echo ========================================
echo.

echo [1/2] 启动 Metro Bundler（模拟器模式）...
start "Metro Bundler" cmd /k "start-emulator.bat"

echo 等待 Metro Bundler 启动...
timeout /t 5 /nobreak >nul

echo [2/2] 启动日志查看器...
start "Android Logs" cmd /k "view-logs.bat"

echo.
echo ========================================
echo ✓ 已启动两个窗口：
echo   1. Metro Bundler (端口 8082, 本地模式)
echo   2. Android 日志查看器
echo ========================================
echo.
echo 现在可以在模拟器中启动应用
echo 应用会自动连接到 localhost:8082
echo.
pause
