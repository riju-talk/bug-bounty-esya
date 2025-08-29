#!/bin/bash

# App-Ocalypse Competition Branch Setup Script
# Run this script to create all wave branches for the event

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for git
if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed. Please install Git and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Setting up App-Ocalypse competition branches...${NC}"

# Create and populate Wave 0 (Start - Easy bugs)
echo -e "\n${YELLOW}📦 Wave 0: Creating easy starter bugs...${NC}"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository. Please run this script from the project root.${NC}"
    exit 1
fi

# Create wave-0 branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/wave-0; then
    git checkout -b wave-0
    
    # Remove some complex bugs, keep only basic functional issues
    git rm -f js/security-issues.js js/search.js js/config.js sw.js 2>/dev/null || true
    
    # Create a simple config file
    cat > js/config.js << 'EOL'
// Basic configuration for Wave 0
const CONFIG = {
    API_URL: '/api',
    DEBUG: true,
    MAX_ITEMS: 50
};
EOL

    # Commit Wave 0 state
    git add .
    git commit -m "Wave 0: Initial 8 bugs deployed (115 points) - Easy warm-up round"
    echo -e "${GREEN}✅ Wave 0 setup complete!${NC}"
else
    echo -e "${YELLOW}ℹ️ Wave 0 branch already exists. Skipping...${NC}"
    git checkout wave-0
fi

# Create Wave 1 (15 min mark - More functional complexity)  
git checkout -b wave-1
echo "🌊 Wave 1: Adding complex functional bugs..."

# Add back some functionality but keep security bugs out
cat > js/search-basic.js << 'EOF'
// Basic search with case-sensitive bug (no XSS yet)
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.js-searchInput')
        this.initSearch()
    }
    
    initSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch()
                }
            })
        }
    }
    
    performSearch() {
        const query = this.searchInput.value
        
        // Case-sensitive search bug - no lowercasing
        const results = productsDOM.products.filter(product => {
            return product.title.includes(query) // Should use toLowerCase()
        })
        
        console.log(`Found ${results.length} results for "${query}"`)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager()
})
EOF

git add .
git commit -m "Wave 1: +9 complex functional bugs deployed (+155 points) - Ramp up difficulty"

# Create Wave 2 (30 min mark - Security vulnerabilities)
git checkout -b wave-2  
echo "🌊🌊 Wave 2: Injecting security vulnerabilities..."

# Add back security-related files with vulnerabilities
git checkout main -- js/search.js js/config.js 2>/dev/null || true

git add .
git commit -m "Wave 2: +9 critical security bugs deployed (+285 points) - Security breach!"

# Create Wave 3 (45 min mark - Nightmare level)
git checkout -b wave-3
echo "🌊🌊🌊 Wave 3: Deploying nightmare-level bugs..."

# Add back all remaining complex files
git checkout main -- js/security-issues.js sw.js 2>/dev/null || true

git add .
git commit -m "Wave 3: +10 nightmare bugs deployed (+395 points) - Expert level required!"

# Create bonus branch with all hidden bugs
git checkout -b bonus-bugs
echo "🎁 Bonus: All hidden bugs available for discovery..."

git add .
git commit -m "Bonus Round: All 46 bugs available - Hidden challenges unlocked!"

# Return to main
git checkout main

echo "✅ Competition branches created successfully!"
echo ""
echo "📋 Branch Summary:"
echo "  wave-0: 8 bugs (115 points) - Easy warm-up"
echo "  wave-1: 17 bugs (270 points) - Complex functional"  
echo "  wave-2: 26 bugs (555 points) - Security critical"
echo "  wave-3: 36 bugs (950 points) - Nightmare level"
echo "  bonus-bugs: 46 bugs (1285 points) - Complete challenge"
echo ""
echo "🎯 Ready for App-Ocalypse! Teams start with: git checkout wave-0"