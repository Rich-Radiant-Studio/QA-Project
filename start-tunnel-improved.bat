@echo off
echo ========================================
echo 清除缓存并启动开发服务器
echo 模式: Development Client + Tunnel
echo 端口: 8082
echo ========================================
echo.

echo [1/5] 停止现有的 Node 进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM ngrok.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✓ 已停止现有进程

echo [2/5] 清除缓存...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ 已删除 node_modules/.cache
)
if exist .expo (
    rmdir /s /q .expo
    echo ✓ 已删除 .expo
)

echo [3/5] 清除临时文件...
if exist %TEMP%\metro-* (
    del /q %TEMP%\metro-* 2>nul
)
if exist %TEMP%\react-* (
    del /q %TEMP%\react-* 2>nul
)
if exist %TEMP%\ngrok-* (
    del /q %TEMP%\ngrok-* 2>nul
)
echo ✓ 临时文件已清除

echo [4/5] 检查 ngrok 配置...
where ngrok >nul 2>&1
if errorlevel 1 (
    echo ⚠ 警告: 未找到 ngrok，将使用 Expo 内置的 ngrok
) else (
    echo ✓ ngrok 已安装
)

echo [5/5] 启动服务器...
echo.
echo ========================================
echo 服务器启动中...
echo 模式: Development Client + Tunnel
echo 端口: 8082
echo.
echo 注意: Tunnel 连接可能需要 1-2 分钟
echo 如果超时，请检查网络连接或使用本地模式
echo ========================================
echo.

REM 设置环境变量以增加超时时间
set EXPO_TUNNEL_TIMEOUT=120000
set REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1

REM 启动服务器，增加详细日志
npx expo start -c --tunnel --port 8082 --dev-client --verbose

pause
