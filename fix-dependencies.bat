@echo off
echo ========================================
echo Fix Package Dependencies
echo ========================================
echo.

echo Step 1: Remove node_modules and package-lock.json
echo.
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo.
echo Step 2: Clean npm cache
call npm cache clean --force

echo.
echo Step 3: Reinstall dependencies with legacy peer deps
call npm install --legacy-peer-deps

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCESS] Dependencies fixed
    echo ========================================
    echo.
    echo Next step: Run eas-build-final.bat
) else (
    echo.
    echo ========================================
    echo [ERROR] Installation failed
    echo ========================================
)

echo.
pause
