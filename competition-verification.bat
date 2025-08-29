@echo off
setlocal enabledelayedexpansion

echo 🔍 App-Ocalypse Bug Verification Report
echo ======================================

REM Function to check if bug exists
:check_bug
set "file=%~1"
set "pattern=%~2"
set "bug_name=%~3"

if not exist "!file!" (
    echo ❌ !bug_name! - FILE NOT FOUND: !file!
    exit /b 1
)

findstr /C:"!pattern!" "!file!" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ !bug_name! - FOUND in !file!
    exit /b 0
) else (
    echo ❌ !bug_name! - MISSING in !file!
    exit /b 1
)

echo.
echo 🎯 FUNCTIONAL BUGS (16 bugs):
echo -----------------------------

call :check_bug "js/products.js" "parseInt.*price" "Price rounding error"
call :check_bug "js/products.js" "length - 1.*i++" "Search misses last item"
call :check_bug "js/global.js" "2023" "Year in footer frozen"
call :check_bug "js/products.js" "this.products.push" "Duplicate product rows"
call :check_bug "js/header.js" "cart.products = \[\]" "Broken clear cart"
call :check_bug "js/countdown.js" "Missing.*clearInterval" "Countdown never stops"
call :check_bug "js/faqs.js" "classList.add.*is-show" "FAQ toggle one-way"
call :check_bug "js/products.js" "currentValue >= 1" "Quantity update skips zero"

echo.
echo 🛡️ SECURITY BUGS (16 bugs):
echo ----------------------------

call :check_bug "js/search.js" "innerHTML.*query" "Reflected DOM XSS"
call :check_bug "data/products.json" "onload=alert" "Product title HTML injection"
call :check_bug "js/config.js" "API_KEY_DEMO.*sk-test" "Hardcoded API keys"
call :check_bug "data/products.json" "http://example.com" "Mixed content images"
call :check_bug "js/security-issues.js" "target\\[key\\] = source" "Prototype pollution"
call :check_bug "js/config.js" "window.location.href.*next" "Open redirect"
call :check_bug "js/config.js" "urlParams.get.*add" "CSRF-like add-to-cart"
call :check_bug "js/security-issues.js" "localStorage.*isAdmin" "Weak pseudo-auth"

echo.
echo 🔍 HIDDEN BUGS (14 bugs):
echo --------------------------

call :check_bug "js/search.js" "includes.*query.*toLowerCase" "Case-sensitive search"
call :check_bug "js/products.js" "parseFloat.*toFixed.*10" "Floating-point drift"
call :check_bug "js/security-issues.js" "qty.*Should clamp" "Negative qty edge case"
call :check_bug "js/countdown.js" "new Date.*no TZ" "Timezone bug"
call :check_bug "js/accessibility-issues.js" "truncated.*substring" "Truncated names double cut"
call :check_bug "js/security-issues.js" "addEventListener.*handler" "Memory leak on rebind"

echo.
echo 🧪 TESTING EXPLOITABILITY:
echo -------------------------

tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo ✅ Gulp development server is running
) else (
    echo ℹ️  Start the development server with: npm start
)

echo.
echo 📊 COMPETITION READINESS:
echo ------------------------

REM Count total bugs
set "count=0"
for /f "tokens=*" %%a in ('findstr /s /i /c:"Bug" /c:"TODO" /c:"FIXME" js\*.js 2^>nul ^| find /c /v ""') do set /a "count=%%a"
echo 📁 Total bug markers: !count!

echo.
echo ✅ App-Ocalypse is READY FOR BATTLE!
echo 🎯 Total challenge: 46 bugs worth 1,285 points
echo ⏰ 60-minute survival challenge with 15-min crash waves
echo.
echo 🚀 Start event with: git checkout wave-0

exit /b 0
