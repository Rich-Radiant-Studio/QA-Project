@echo off
echo ========================================
echo QA Admin 部署到 Vercel
echo ========================================
echo.

echo [1/3] 检查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Vercel CLI 未安装，正在安装...
    call npm install -g vercel
) else (
    echo Vercel CLI 已安装
)
echo.

echo [2/3] 登录 Vercel...
echo 请在浏览器中完成登录...
call vercel login
echo.

echo [3/3] 部署项目...
call vercel --prod
echo.

echo ========================================
echo 部署完成！
echo ========================================
pause
