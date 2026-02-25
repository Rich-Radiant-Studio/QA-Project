@echo off
echo ========================================
echo EAS Build Status
echo ========================================
echo.

call npx eas build:list

echo.
echo ========================================
echo Other useful commands:
echo ========================================
echo.
echo View specific build details:
echo   npx eas build:view [BUILD_ID]
echo.
echo Download build artifact:
echo   npx eas build:download [BUILD_ID]
echo.
echo Run on device:
echo   npx eas build:run -p android
echo   npx eas build:run -p ios
echo.
echo Cancel build:
echo   npx eas build:cancel [BUILD_ID]
echo.
pause
