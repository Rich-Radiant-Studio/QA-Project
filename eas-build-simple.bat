@echo off
echo ========================================
echo EAS Build - Simple Mode (No Interaction)
echo ========================================
echo.

echo Starting build without interactive prompts...
echo This will use default Expo signing.
echo.

call npx eas build --profile development --platform android --non-interactive

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] Build submitted
    echo ========================================
    echo.
    echo Check status: npx eas build:list
) else (
    echo.
    echo ========================================
    echo [ERROR] Build failed
    echo ========================================
)

echo.
pause
