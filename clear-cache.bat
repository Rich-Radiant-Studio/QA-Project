@echo off
echo ========================================
echo 清除 React Native / Expo 缓存
echo ========================================
echo.

echo [1/6] 停止 Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] 删除 node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ 已删除 node_modules/.cache
) else (
    echo - node_modules/.cache 不存在
)

echo [3/6] 删除 .expo 缓存...
if exist .expo (
    rmdir /s /q .expo
    echo ✓ 已删除 .expo
) else (
    echo - .expo 不存在
)

echo [4/6] 清除 Metro bundler 缓存...
call npx react-native start --reset-cache --no-interactive 2>nul
timeout /t 2 /nobreak >nul
taskkill /F /IM node.exe 2>nul

echo [5/6] 清除 Expo 缓存...
call npx expo start -c --no-dev --minify 2>nul
timeout /t 2 /nobreak >nul
taskkill /F /IM node.exe 2>nul

echo [6/6] 删除临时文件...
if exist %TEMP%\metro-* (
    del /q %TEMP%\metro-* 2>nul
    echo ✓ 已删除 Metro 临时文件
)
if exist %TEMP%\react-* (
    del /q %TEMP%\react-* 2>nul
    echo ✓ 已删除 React 临时文件
)

echo.
echo ========================================
echo ✓ 缓存清除完成！
echo ========================================
echo.
echo 现在请运行以下命令重新启动：
echo   npx expo start -c --tunnel
echo.
pause
