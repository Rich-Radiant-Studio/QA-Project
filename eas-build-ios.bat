@echo off
echo ========================================
echo EAS Build - iOS Development Build
echo ========================================
echo.

echo NOTE: iOS build requires Apple Developer Account
echo.
set /p CONFIRM="Apple Developer Account ready? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo Please prepare:
    echo   1. Apple Developer Account
    echo   2. Bundle Identifier
    echo   3. Configure ios.bundleIdentifier in app.json
    echo.
    pause
    exit /b 0
)

echo.
echo ========================================
echo Start Building iOS
echo ========================================
echo.
echo This will use 1 EAS Build credit
echo Estimated time: 25-35 minutes
echo.
set /p CONFIRM2="Confirm to start build? (y/n): "
if /i not "%CONFIRM2%"=="y" (
    echo Cancelled
    pause
    exit /b 0
)

echo.
echo Starting build...
call npx eas build --profile development --platform ios

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
    echo   1. Scan QR code (need to register device UDID)
    echo   2. Use TestFlight
    echo   3. Use EAS CLI: npx eas build:run -p ios
) else (
    echo.
    echo ========================================
    echo [ERROR] Build submission failed
    echo ========================================
)

echo.
pause
