@echo off
echo ========================================
echo 启动服务器并打开日志查看器
echo ========================================
echo.

echo [1/2] 启动 Metro Bundler...
start "Metro Bundler" cmd /k "start-clean.bat"

echo 等待 Metro Bundler 启动...
timeout /t 5 /nobreak >nul

echo [2/2] 启动日志查看器...
start "Android Logs" cmd /k "view-logs.bat"

echo.
echo ========================================
echo ✓ 已启动两个窗口：
echo   1. Metro Bundler (端口 8082)
echo   2. Android 日志查看器
echo ========================================
echo.
echo 现在可以在模拟器中启动应用
echo.
pause
