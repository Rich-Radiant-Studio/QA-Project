@echo off
echo ========================================
echo Starting Expo Public Server
echo ========================================
echo.

REM 设置 ngrok 路径
set PATH=%PATH%;%CD%\qa-app\tools

echo Starting Expo with tunnel mode on port 8085...
echo.
npx expo start --tunnel --port 8085

pause
