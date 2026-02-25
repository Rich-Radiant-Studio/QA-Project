@echo off
echo ========================================
echo iOS 云端构建 (EAS Build)
echo ========================================
echo.

:menu
echo 选择构建类型:
echo 1. Development Build (开发测试)
echo 2. Production Build (正式发布)
echo 3. 查看构建状态
echo 4. 退出
echo.
set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto status
if "%choice%"=="4" goto end
echo 无效选项，请重新选择
goto menu

:dev
echo.
echo 正在构建 iOS Development Build...
echo 这将消耗 1 次 EAS Build 次数
echo.
call eas build --profile development --platform ios
goto end

:prod
echo.
echo 正在构建 iOS Production Build...
echo 这将消耗 1 次 EAS Build 次数
echo.
call eas build --profile production --platform ios
goto end

:status
echo.
echo 查看构建状态...
echo.
call eas build:list
echo.
pause
goto menu

:end
echo.
pause
