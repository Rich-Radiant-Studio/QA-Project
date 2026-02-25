@echo off
echo ========================================
echo EAS Project Initialization
echo ========================================
echo.

echo This will:
echo   1. Create project on Expo website
echo   2. Configure eas.json
echo   3. Link to your Expo account
echo.

echo Current account: standardinvestment
echo.
set /p CHANGE_ACCOUNT="Change account? (y/n): "

if /i "%CHANGE_ACCOUNT%"=="y" (
    echo.
    echo Logging out...
    call npx eas logout
    echo.
    echo Please login with the correct account:
    call npx eas login
)

echo.
echo ========================================
echo Initializing EAS Build
echo ========================================
echo.

call npx eas build:configure

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] EAS Build configured
    echo ========================================
    echo.
    echo Next step: Run eas-build-android.bat
) else (
    echo.
    echo ========================================
    echo [ERROR] Configuration failed
    echo ========================================
)

echo.
pause
