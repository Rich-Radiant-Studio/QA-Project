@echo off
echo ========================================
echo 深度清理项目（包括 node_modules）
echo ========================================
echo.
echo 警告：此操作将删除 node_modules 并重新安装依赖
echo 这可能需要几分钟时间
echo.
set /p confirm="确认继续？(Y/N): "
if /i not "%confirm%"=="Y" (
    echo 已取消操作
    pause
    exit /b
)

echo.
echo [1/8] 停止所有 Node 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/8] 删除 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ 已删除 node_modules
) else (
    echo - node_modules 不存在
)

echo [3/8] 删除 package-lock.json...
if exist package-lock.json (
    del /q package-lock.json
    echo ✓ 已删除 package-lock.json
)

echo [4/8] 删除 .expo 缓存...
if exist .expo (
    rmdir /s /q .expo
    echo ✓ 已删除 .expo
)

echo [5/8] 删除 Android build 缓存...
if exist android\.gradle (
    rmdir /s /q android\.gradle
    echo ✓ 已删除 android/.gradle
)
if exist android\build (
    rmdir /s /q android\build
    echo ✓ 已删除 android/build
)
if exist android\app\build (
    rmdir /s /q android\app\build
    echo ✓ 已删除 android/app/build
)

echo [6/8] 清除 npm 缓存...
call npm cache clean --force
echo ✓ npm 缓存已清除

echo [7/8] 重新安装依赖...
call npm install
if errorlevel 1 (
    echo ✗ 依赖安装失败
    pause
    exit /b 1
)
echo ✓ 依赖安装完成

echo [8/8] 清除 Metro bundler 缓存...
call npx react-native start --reset-cache --no-interactive 2>nul
timeout /t 2 /nobreak >nul
taskkill /F /IM node.exe 2>nul

echo.
echo ========================================
echo ✓ 深度清理完成！
echo ========================================
echo.
echo 现在请运行以下命令重新启动：
echo   npx expo start -c --tunnel
echo.
pause
