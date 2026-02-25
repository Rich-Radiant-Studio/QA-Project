@echo off
echo ========================================
echo   Development Client + Tunnel 调试模式
echo ========================================
echo.
echo 正在启动服务器...
echo.
echo 提示:
echo   - 使用 Development Build 应用扫描二维码
echo   - 不要使用 Expo Go
echo   - 首次启动需要等待隧道建立 (10-30秒)
echo.
echo ========================================
echo.

npm run start:dev:tunnel
