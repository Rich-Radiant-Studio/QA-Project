@echo off
echo ========================================
echo EAS Build - Final Attempt
echo ========================================
echo.

echo IMPORTANT INSTRUCTIONS:
echo.
echo When asked "Generate a new Android Keystore?"
echo   Answer: Y (yes)
echo.
echo When asked "Path to the Keystore file"
echo   Just press ENTER (leave empty)
echo.
echo The build will then proceed automatically.
echo.
pause

echo.
echo Starting build...
call npx eas build --profile development --platform android

echo.
pause
