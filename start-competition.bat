@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting App-Ocalypse Competition Setup...
echo =========================================

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ npm is not installed. Please install Node.js which includes npm.
    exit /b 1
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies. Please check the error above.
    exit /b 1
)

REM Setup competition branches
echo.
echo 🔄 Setting up competition branches...
call setup-competition-branches.bat
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to set up competition branches.
    exit /b 1
)

REM Verify setup
echo.
echo 🔍 Verifying setup...
call competition-verification.bat
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Some verification checks failed. The competition can still proceed, but some features might not work as expected.
)

echo.
echo =========================================
echo 🎉 App-Ocalypse Competition Setup Complete!
echo =========================================
echo.
echo 📋 What to do next:
echo 1. Start the server: npm start
echo 2. Open http://localhost:3000 in your browser
echo 3. For Wave 0 (beginner): git checkout wave-0
echo 4. For full challenge: git checkout bonus-bugs
echo.
echo 🚀 Good luck and happy hacking!

exit /b 0
