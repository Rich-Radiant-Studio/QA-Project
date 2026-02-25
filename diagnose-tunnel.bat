@echo off
chcp 65001 >nul
echo ========================================
echo Tunnel Connection Diagnostic Tool
echo ========================================
echo.

echo [1/5] Checking ngrok installation...
where ngrok >nul 2>&1
if errorlevel 1 (
    echo X ngrok not installed or not in PATH
    echo   Expo will use built-in ngrok
) else (
    echo OK ngrok is installed
    ngrok version
)
echo.

echo [2/5] Checking network connection...
ping -n 1 ngrok.com >nul 2>&1
if errorlevel 1 (
    echo X Cannot connect to ngrok.com
    echo   Please check network or firewall
) else (
    echo OK Can connect to ngrok.com
)
echo.

echo [3/5] Checking port usage...
netstat -ano | findstr :8082 >nul 2>&1
if errorlevel 1 (
    echo OK Port 8082 is available
) else (
    echo ! Port 8082 is in use
    echo   Processes using port 8082:
    netstat -ano | findstr :8082
)
echo.

echo [4/5] Checking firewall rules...
netsh advfirewall firewall show rule name=all | findstr "Node.js" >nul 2>&1
if errorlevel 1 (
    echo ! Node.js firewall rule not found
    echo   May need to add firewall exception
) else (
    echo OK Found Node.js firewall rule
)
echo.

echo [5/5] Checking Expo configuration...
if exist .expo (
    echo OK .expo directory exists
    dir .expo
) else (
    echo OK .expo directory does not exist (will be created on start)
)
echo.

echo ========================================
echo Diagnosis Complete
echo ========================================
echo.
echo Recommendations:
echo 1. If cannot connect to ngrok.com, check network or use VPN
echo 2. If port is in use, close the program using it
echo 3. If tunnel still fails, try LAN mode:
echo    start-lan.bat
echo 4. For emulator, recommend local mode:
echo    start-emulator.bat
echo.
pause
