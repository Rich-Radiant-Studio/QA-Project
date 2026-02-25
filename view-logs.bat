@echo off
echo Starting Android logcat...
echo Press Ctrl+C to stop
echo.
adb logcat | findstr /i "i18n translation"
