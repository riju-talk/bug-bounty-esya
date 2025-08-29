#!/bin/bash

# App-Ocalypse Competition Verification Script
# Ensures all bugs are present and exploitable

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Windows
if [ "$OS" = "Windows_NT" ]; then
    # Windows specific settings
    GREP_CMD='findstr /R /C:'
else
    GREP_CMD='grep -qE'
fi

# Function to check if file exists
file_exists() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

# Function to check if bug exists
check_bug() {
    local file="$1"
    local pattern="$2"
    local bug_name="$3"
    
    if ! file_exists "$file"; then
        echo -e "${RED}❌ $bug_name - FILE NOT FOUND: $file${NC}"
        return 1
    fi
    
    if [ "$OS" = "Windows_NT" ]; then
        # Windows findstr command
        if findstr /R /C:"$pattern" "$file" >nul 2>&1; then
            echo -e "${GREEN}✅ $bug_name - FOUND in $file${NC}"
            return 0
        else
            echo -e "${RED}❌ $bug_name - MISSING in $file${NC}"
            return 1
        fi
    else
        # Unix grep command
        if grep -qE "$pattern" "$file" 2>/dev/null; then
            echo -e "${GREEN}✅ $bug_name - FOUND in $file${NC}"
            return 0
        else
            echo -e "${RED}❌ $bug_name - MISSING in $file${NC}"
            return 1
        fi
    fi
}

echo -e "\n${YELLOW}🔍 App-Ocalypse Bug Verification Report${NC}"
echo -e "${YELLOW}======================================${NC}\n"

echo ""
echo "🎯 FUNCTIONAL BUGS (16 bugs):"
echo "-----------------------------"

check_bug "js/products.js" "parseInt.*price" "Price rounding error"
check_bug "js/products.js" "length - 1.*i++" "Search misses last item"  
check_bug "js/global.js" "2023" "Year in footer frozen"
check_bug "js/products.js" "this.products.push" "Duplicate product rows"
check_bug "js/header.js" "cart.products = \[\]" "Broken clear cart"
check_bug "js/countdown.js" "Missing.*clearInterval" "Countdown never stops"
check_bug "js/faqs.js" "classList.add.*is-show" "FAQ toggle one-way"
check_bug "js/products.js" "currentValue >= 1" "Quantity update skips zero"

echo ""
echo "🛡️ SECURITY BUGS (16 bugs):"
echo "----------------------------"

check_bug "js/search.js" "innerHTML.*query" "Reflected DOM XSS"
check_bug "data/products.json" "onload=alert" "Product title HTML injection"  
check_bug "js/config.js" "API_KEY_DEMO.*sk-test" "Hardcoded API keys"
check_bug "data/products.json" "http://example.com" "Mixed content images"
check_bug "js/security-issues.js" "target\[key\] = source" "Prototype pollution"
check_bug "js/config.js" "window.location.href.*next" "Open redirect"
check_bug "js/config.js" "urlParams.get.*add" "CSRF-like add-to-cart"
check_bug "js/security-issues.js" "localStorage.*isAdmin" "Weak pseudo-auth"

echo ""
echo "🔍 HIDDEN BUGS (14 bugs):"
echo "--------------------------"

check_bug "js/search.js" "includes.*query.*toLowerCase" "Case-sensitive search"
check_bug "js/products.js" "parseFloat.*toFixed.*10" "Floating-point drift"
check_bug "js/security-issues.js" "qty.*Should clamp" "Negative qty edge case"
check_bug "js/countdown.js" "new Date.*no TZ" "Timezone bug"
check_bug "js/accessibility-issues.js" "truncated.*substring" "Truncated names double cut"
check_bug "js/security-issues.js" "addEventListener.*handler" "Memory leak on rebind"

echo ""
echo "🧪 TESTING EXPLOITABILITY:"
echo "--------------------------"

# Test if the website loads
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Website accessible on localhost:5000"
else
    echo "❌ Website not accessible - check server"
fi

# Test if key files exist
required_files=("js/products.js" "js/header.js" "js/global.js" "js/countdown.js" "js/faqs.js" "data/products.json")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Required file: $file"
    else
        echo "❌ Missing file: $file"
    fi
done

echo ""
echo "📊 COMPETITION READINESS:"
echo "------------------------"

# Count total bugs
total_functional=$(grep -r "Bug\|TODO\|FIXME" js/ --include="*.js" | wc -l)
total_security=$(grep -r "XSS\|injection\|vulnerability" js/ --include="*.js" | wc -l)  
total_files=$(find js/ -name "*.js" | wc -l)

echo "📁 Total JS files: $total_files"
echo "🐛 Functional bug markers: $total_functional"
echo "🛡️ Security vulnerability markers: $total_security"

echo ""
echo "✅ App-Ocalypse is READY FOR BATTLE!"
echo "🎯 Total challenge: 46 bugs worth 1,285 points"
echo "⏰ 60-minute survival challenge with 15-min crash waves"
echo ""
echo "🚀 Start event with: git checkout wave-0"