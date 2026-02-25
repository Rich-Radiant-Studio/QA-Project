@echo off
echo ========================================
echo 清除缓存并启动开发服务器
echo 端口: 8082 (Tunnel 模式)
echo ========================================
echo.

echo [1/4] 停止现有的 Node 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✓ 已停止现有进程

echo [2/4] 清除缓存...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ 已删除 node_modules/.cache
)
if exist .expo (
    rmdir /s /q .expo
    echo ✓ 已删除 .expo
)

echo [3/4] 清除临时文件...
if exist %TEMP%\metro-* (
    del /q %TEMP%\metro-* 2>nul
)
if exist %TEMP%\react-* (
    del /q %TEMP%\react-* 2>nul
)
echo ✓ 临时文件已清除

echo [4/4] 启动开发服务器...
echo.
echo ========================================
echo 服务器启动中...
echo 模式: Development Client + Tunnel
echo 端口: 8082
echo ========================================
echo.

set REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1
npx expo start -c --tunnel --port 8082 --dev-client

pause
