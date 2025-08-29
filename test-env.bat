@echo off
echo Testing Windows environment...
echo ===========================

echo.
echo 1. Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is not installed or not in PATH
)

echo.
echo 2. Checking npm installation...
where npm >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ npm is installed
    npm --version
) else (
    echo ❌ npm is not installed or not in PATH
)

echo.
echo 3. Checking Git installation...
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Git is installed
    git --version
) else (
    echo ⚠️  Git is not installed (optional but recommended)
)

echo.
echo 4. Checking directory structure...
if exist "js" (
    echo ✅ Found js directory
) else (
    echo ❌ Missing js directory
)

if exist "views" (
    echo ✅ Found views directory
) else (
    echo ❌ Missing views directory
)

echo.
echo 5. Checking required files...
if exist "server.js" (
    echo ✅ Found server.js
) else (
    echo ❌ Missing server.js
)

if exist "package.json" (
    echo ✅ Found package.json
) else (
    echo ❌ Missing package.json
)

echo.
echo ===========================
echo Environment test complete!
if %ERRORLEVEL% equ 0 (
    echo ✅ Environment looks good!
) else (
    echo ⚠️  Some checks failed. Please address the issues above.
)

pause
