@echo off
echo ========================================
echo Download APK from EAS Build
echo ========================================
echo.

echo Downloading latest build...
call npx eas build:download --id 29e46008-947c-4137-ad09-ef26f61da183

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] APK downloaded
    echo ========================================
    echo.
    echo The APK file is in the current directory.
    echo Transfer it to your Android device and install.
) else (
    echo.
    echo ========================================
    echo [ERROR] Download failed
    echo ========================================
    echo.
    echo Please visit:
    echo https://expo.dev/accounts/standardinvestment/projects/qa-native-app/builds
    echo.
    echo And download manually from the website.
)

echo.
pause
