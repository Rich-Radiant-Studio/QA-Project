@echo off
chcp 65001 >nul
echo ========================================
echo 服务连接诊断工具
echo ========================================
echo.

echo [1/5] 检查后端服务器连接...
echo 服务器地址: http://27.8.143.201:30560/qa-hero-app-user
curl -s -o nul -w "HTTP状态码: %%{http_code}\n连接时间: %%{time_total}秒\n" http://27.8.143.201:30560/qa-hero-app-user
if errorlevel 1 (
    echo ❌ 无法连接到后端服务器
    echo 可能原因:
    echo   - 服务器未启动
    echo   - 网络连接问题
    echo   - 防火墙阻止
) else (
    echo ✅ 后端服务器可访问
)
echo.

echo [2/5] 检查端口占用情况...
netstat -ano | findstr :8082 >nul
if errorlevel 1 (
    echo ✅ 端口 8082 未被占用
) else (
    echo ⚠️  端口 8082 已被占用
    echo 占用端口的进程:
    netstat -ano | findstr :8082
)
echo.

echo [3/5] 检查 Node.js 和 npm...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装
) else (
    echo ✅ Node.js 版本:
    node --version
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装
) else (
    echo ✅ npm 版本:
    npm --version
)
echo.

echo [4/5] 检查 Expo CLI...
npx expo --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Expo CLI 未安装
) else (
    echo ✅ Expo CLI 版本:
    npx expo --version
)
echo.

echo [5/5] 检查项目依赖...
if exist "node_modules" (
    echo ✅ node_modules 文件夹存在
) else (
    echo ❌ node_modules 文件夹不存在
    echo 请运行: npm install
)
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
echo 📋 当前配置:
echo   - 后端服务器: http://27.8.143.201:30560/qa-hero-app-user
echo   - 开发端口: 8082
echo   - 启动模式: Development Client + Tunnel
echo.
echo 🚀 推荐启动命令:
echo   npm run start:tunnel
echo.
echo 📖 详细文档: SERVICE_CONNECTION_GUIDE.md
echo.
pause
