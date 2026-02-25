@echo off
chcp 65001 >nul
echo ========================================
echo 启动 Tunnel 模式开发服务器
echo ========================================
echo.
echo 正在启动，请稍候...
echo Tunnel 建立可能需要 1-2 分钟
echo.
echo 启动后：
echo 1. 等待看到 "Tunnel ready" 提示
echo 2. 扫描显示的二维码
echo 3. 或手动输入 exp:// 开头的地址
echo.
echo ========================================
echo.

npx expo start --dev-client --tunnel --port 8082

pause
