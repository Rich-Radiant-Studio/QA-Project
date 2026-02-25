@echo off
chcp 65001 >nul
cls
echo ========================================
echo QA App - Development Server Launcher
echo ========================================
echo.
echo Please select startup mode:
echo.
echo 1. Emulator Mode (Recommended for development)
echo    - Fastest speed
echo    - Most stable
echo    - With logs
echo.
echo 2. Tunnel Mode (For remote testing)
echo    - Can access from anywhere
echo    - May be slow
echo    - May timeout
echo.
echo 3. LAN Mode (For device on same WiFi)
echo    - Fast speed
echo    - Requires same network
echo.
echo 4. Diagnose tunnel issues
echo.
echo 5. Deep clean (if having cache issues)
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Starting Emulator Mode with logs...
    call start-emulator-with-logs.bat
) else if "%choice%"=="2" (
    echo.
    echo Starting Tunnel Mode...
    call start-tunnel-improved.bat
) else if "%choice%"=="3" (
    echo.
    echo Starting LAN Mode...
    call start-lan.bat
) else if "%choice%"=="4" (
    echo.
    call diagnose-tunnel.bat
) else if "%choice%"=="5" (
    echo.
    call deep-clean.bat
) else (
    echo.
    echo Invalid choice. Please run again and select 1-5.
    pause
)
