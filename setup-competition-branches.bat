@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up App-Ocalypse competition branches...

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is not installed. Please install Git and try again.
    exit /b 1
)

REM Check if in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Not a git repository. Please run this script from the project root.
    exit /b 1
)

echo.
echo 📦 Wave 0: Creating easy starter bugs...

REM Create wave-0 branch if it doesn't exist
git show-ref --verify --quiet refs/heads/wave-0
if %ERRORLEVEL% neq 0 (
    git checkout -b wave-0
    
    REM Remove some complex bugs, keep only basic functional issues
    git rm -f js/security-issues.js js/search.js js/config.js sw.js 2>nul || echo "Files already removed"
    
    REM Create a simple config file
    (
        echo // Basic configuration for Wave 0
        echo const CONFIG = {
        echo     API_URL: '/api',
        echo     DEBUG: true,
        echo     MAX_ITEMS: 50
        echo };
    ) > js/config.js
    
    REM Commit Wave 0 state
    git add .
    git commit -m "Wave 0: Initial 8 bugs deployed (115 points) - Easy warm-up round"
    echo ✅ Wave 0 setup complete!
) else (
    echo ℹ️  Wave 0 branch already exists. Skipping...
    git checkout wave-0
)

REM Create Wave 1 (15 min mark - More functional complexity)
git checkout -b wave-1
echo.
echo 🌊 Wave 1: Adding complex functional bugs...

REM Add back some functionality but keep security bugs out
(
    echo // Basic search with case-sensitive bug (no XSS yet)
    echo class SearchManager {
    echo     constructor() {
    echo         this.searchInput = document.querySelector('.js-searchInput')
    echo         this.initSearch()
    echo     }
    echo     
    echo     initSearch() {
    echo         if (this.searchInput) {
    echo             this.searchInput.addEventListener('keypress', (e) => {
    echo                 if (e.key === 'Enter') {
    echo                     this.performSearch()
    echo                 }
    echo             })
    echo         }
    echo     }
    echo     
    echo     performSearch() {
    echo         const query = this.searchInput.value
    echo         
    echo         // Case-sensitive search bug - no lowercasing
    echo         const results = productsDOM.products.filter(product => {
    echo             return product.title.includes(query) // Should use toLowerCase()
    echo         })
    echo         
    echo         console.log(`Found ${results.length} results for "${query}"`)
    echo     }
    echo }
    echo 
    echo document.addEventListener('DOMContentLoaded', () => {
    echo     window.searchManager = new SearchManager()
    echo })
) > js/search-basic.js

git add .
git commit -m "Wave 1: +9 complex functional bugs deployed (+155 points) - Ramp up difficulty"

REM Create Wave 2 (30 min mark - Security vulnerabilities)
git checkout -b wave-2
echo.
echo 🌊🌊 Wave 2: Injecting security vulnerabilities...

REM Add back security-related files with vulnerabilities
git checkout main -- js/search.js js/config.js 2>nul || echo "Files already restored"

git add .
git commit -m "Wave 2: +9 critical security bugs deployed (+285 points) - Security breach!"

REM Create Wave 3 (45 min mark - Nightmare level)
git checkout -b wave-3
echo.
echo 🌊🌊🌊 Wave 3: Deploying nightmare-level bugs...

REM Add back all remaining complex files
git checkout main -- js/security-issues.js sw.js 2>nul || echo "Files already restored"

git add .
git commit -m "Wave 3: +10 nightmare bugs deployed (+395 points) - Expert level required!"

REM Create bonus branch with all hidden bugs
git checkout -b bonus-bugs
echo.
echo 🎁 Bonus: All hidden bugs available for discovery...

git add .
git commit -m "Bonus Round: All 46 bugs available - Hidden challenges unlocked!"

REM Return to main
git checkout main

echo.
echo ✅ Competition branches created successfully!
echo.
echo 📋 Branch Summary:
echo   wave-0: 8 bugs (115 points) - Easy warm-up
echo   wave-1: 17 bugs (270 points) - Complex functional
echo   wave-2: 26 bugs (555 points) - Security critical
echo   wave-3: 36 bugs (950 points) - Nightmare level
echo   bonus-bugs: 46 bugs (1285 points) - Complete challenge
echo.
echo 🎯 Ready for App-Ocalypse! Teams start with: git checkout wave-0

exit /b 0
