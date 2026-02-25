@echo off
echo ========================================
echo 清除缓存并启动开发服务器
echo 模式: Development Client + LAN
echo 端口: 8082
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

echo [4/4] 获取本机 IP 地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
echo 本机 IP: %IP%

echo.
echo ========================================
echo 服务器启动中...
echo 模式: Development Client + LAN
echo 端口: 8082
echo ========================================
echo.

npx expo start -c --lan --port 8082 --dev-client

pause
