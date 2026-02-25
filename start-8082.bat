@echo off
echo ========================================
echo 启动开发服务器
echo 端口: 8082 (Tunnel 模式)
echo ========================================
echo.

echo 停止现有的 Node 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 服务器启动中...
echo.

set REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1
npx expo start --tunnel --port 8082 --dev-client

pause
