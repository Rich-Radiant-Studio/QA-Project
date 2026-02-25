@echo off
echo ========================================
echo EAS Build - Android Development Build
echo ========================================
echo.

echo Step 1: Login to Expo Account
echo.
call npx eas login
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Login failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Start Building Android
echo ========================================
echo.
echo This will use 1 EAS Build credit
echo Estimated time: 15-20 minutes
echo.
set /p CONFIRM="Confirm to start build? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Cancelled
    pause
    exit /b 0
)

echo.
echo Starting build...
call npx eas build --profile development --platform android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] Build submitted to EAS Build
    echo ========================================
    echo.
    echo Check build status:
    echo   Web: https://expo.dev/accounts/[your-account]/projects/problem-to-hero/builds
    echo   CLI: npx eas build:list
    echo.
    echo After build completes, install via:
    echo   1. Scan QR code
    echo   2. Download APK file
    echo   3. Use EAS CLI: npx eas build:run -p android
) else (
    echo.
    echo ========================================
    echo [ERROR] Build submission failed
    echo ========================================
)

echo.
pause
