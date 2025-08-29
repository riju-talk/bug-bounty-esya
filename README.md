# 🚀 App-Ocalypse: Debugging Survival Challenge

## 🎯 **Competition Overview**

Welcome to **App-Ocalypse** - a high-stakes debugging survival challenge designed for Esya '25, IIIT-Delhi. This deliberately vulnerable ecommerce application contains **46 intentional bugs** across functional, security, and hidden edge case categories for educational and competitive debugging practice.

**⚠️ WARNING: This project should NEVER be used in production or deployed to a public server.**

---

## 🌊 **Wave-Based Bug Distribution**

The competition uses a progressive wave system where bugs are released in 4 waves every 15 minutes:

### 📊 **Scoring System**
- **Total Bugs**: 46 bugs across all categories
- **Total Points**: 1,285 points maximum
- **Duration**: 60 minutes (4 waves × 15 minutes)
- **Team Size**: 2-3 members

### 🎚️ **Difficulty Progression**
```
Wave 0 (Start):    8 bugs  →  115 points  →  Basic functional issues
Wave 1 (+15min):  +9 bugs  → +155 points  →  Complex functional bugs
Wave 2 (+30min):  +9 bugs  → +285 points  →  Critical security flaws  
Wave 3 (+45min): +10 bugs  → +395 points  →  Nightmare-level challenges
Bonus (Hidden):  +12 bugs  → +330 points  →  Expert discovery challenges
```

---

## 🐛 **Complete Bug Inventory (46 Bugs)**

### 🔧 **Wave 0: Functional Bugs (8 bugs, 115 points)**

| Bug | File | Points | Description |
|-----|------|--------|-------------|
| **Cart count desync** | `js/products.js` | 15 | Cart badge shows count-1 instead of actual count |
| **Price rounding error** | `js/products.js` | 10 | parseInt instead of parseFloat causes price truncation |
| **Year in footer frozen** | `js/global.js` | 5 | Footer shows hardcoded 2023 instead of current year |
| **FAQ toggle one-way** | `js/faqs.js` | 10 | FAQ only opens, never closes (add vs toggle) |
| **Search misses last item** | `js/products.js` | 15 | Off-by-one loop error skips final product |
| **Broken "Clear cart"** | `js/header.js` | 15 | Clears array but not localStorage, cart persists |
| **Featured buttons wrong target** | `js/featured.js` | 15 | All buttons scroll to #products instead of specific sections |
| **Wrong currency symbol** | `js/products.js` | 15 | Hardcoded INR format for all locales |

### ⚙️ **Wave 1: Complex Functional Bugs (+9 bugs, +155 points)**

| Bug | File | Points | Description |
|-----|------|--------|-------------|
| **Quantity update skips zero** | `js/products.js` | 10 | >= 1 condition blocks zero quantities |
| **Duplicate product rows** | `js/products.js` | 20 | Always push to array, never merge existing items |
| **Wrong category filter** | `js/products.js` | 20 | Case mismatch in category comparison |
| **Broken pagination** | `js/security-issues.js` | 15 | page * size instead of (page-1)*size offset |
| **Sticky header flicker** | `js/header.js` | 15 | Inconsistent scroll threshold values |
| **Slider "Next" skips items** | `js/slider.js` | 20 | Double increment bug on navigation |
| **Missing debounce on add-btn** | `js/products.js` | 20 | Rapid clicks spam cart with duplicates |
| **Case-sensitive search** | `js/search.js` | 15 | Missing toLowerCase() normalization |
| **Truncated names double cut** | `js/accessibility-issues.js` | 20 | CSS truncation + JS substring = double cut |

### 🛡️ **Wave 2: Security Vulnerabilities (+9 bugs, +285 points)**

| Bug | File | Points | Description |
|-----|------|--------|-------------|
| **Reflected DOM XSS in search** | `js/search.js` | 40 | innerHTML with unsanitized user query |
| **Product title HTML injection** | `data/products.json` | 35 | SVG onload payload in JSON product data |
| **Weak coupon validation** | `js/products.js` | 25 | Accepts any string with length > 0 |
| **LocalStorage trust** | `js/security-issues.js` | 30 | Client-side isAdmin flag trusted |
| **HTML injection in toasts** | `js/toast.js` | 35 | innerHTML with user-controlled strings |
| **Sensitive data in source** | `js/config.js` | 35 | Hardcoded API keys committed to repo |
| **Open redirect** | `js/config.js` | 40 | Unvalidated next parameter in redirects |
| **Countdown never stops** | `js/countdown.js` | 20 | clearInterval commented out |
| **Misapplied coupon** | `js/products.js` | 25 | Double discount application bug |

### ⚡ **Wave 3: Nightmare-Level Challenges (+10 bugs, +395 points)**

| Bug | File | Points | Description |
|-----|------|--------|-------------|
| **Stored XSS in reviews** | `js/security-issues.js` | 45 | Persistent XSS in comment storage |
| **Prototype pollution** | `js/security-issues.js` | 50 | No key filtering in object merge |
| **CSRF-like add-to-cart** | `js/config.js` | 35 | URL parameter auto-adds items |
| **Weak pseudo-auth** | `js/security-issues.js` | 40 | localStorage authentication bypass |
| **IDOR fetch orders** | `js/security-issues.js` | 45 | Direct order ID access without validation |
| **Service worker cache poison** | `sw.js` | 50 | Overly broad cache patterns |
| **Fetch race condition** | `js/security-issues.js` | 40 | Last response wins, not latest request |
| **Memory leak on rebind** | `js/security-issues.js` | 35 | Event listeners never removed |
| **Floating-point drift** | `js/products.js` | 30 | Price calculations use floating arithmetic |
| **Negative qty edge case** | `js/security-issues.js` | 25 | Allows -1 input quantities |

### 🔍 **Bonus: Hidden Edge Cases (+12 bugs, +330 points)**

| Bug | File | Points | Description |
|-----|------|--------|-------------|
| **Insecure fetch over HTTP** | `js/config.js` | 30 | HTTP URLs in HTTPS context |
| **Mixed content images** | `data/products.json` | 25 | HTTP image URLs in HTTPS site |
| **Clickjacking** | `index.html` | 30 | No X-Frame-Options protection |
| **Timezone bug in countdown** | `js/countdown.js` | 35 | No timezone handling in date calc |
| **Stale related products** | `js/products.js` | 25 | Cache never refreshed or invalidated |
| **Scroll-to null element** | `js/featured.js` | 20 | Missing null checks on scroll targets |
| **Accessibility regression** | `js/accessibility-issues.js` | 30 | Div used as button without ARIA |
| **Broken back navigation** | `js/accessibility-issues.js` | 35 | No history.pushState for filters |
| **Discount rounding bias** | `js/products.js` | 20 | Math.floor always rounds down |
| **Out-of-stock still purchasable** | `js/products.js` | 30 | No stock validation on checkout |
| **Category slug mismatch** | `js/products.js` | 25 | Human name vs slug comparison |
| **Persisted filters stuck** | `js/products.js` | 25 | localStorage filter never cleared |

---

## 🎯 **Branch Strategy**

### **Git Branch Structure:**
```
main (production-ready with all 46 bugs)
├── wave-0 (8 starter bugs, 115 points)
├── wave-1 (+9 complex bugs, 270 total points) 
├── wave-2 (+9 security bugs, 555 total points)
├── wave-3 (+10 nightmare bugs, 950 total points)
└── bonus-hidden (all 46 bugs, 1285 total points)
```

### **Competition Workflow:**
```bash
# Event start (00:00)
git checkout wave-0

# Wave 1 release (+15 minutes)  
git checkout wave-1 && git pull origin wave-1

# Wave 2 release (+30 minutes)
git checkout wave-2 && git pull origin wave-2

# Wave 3 release (+45 minutes)
git checkout wave-3 && git pull origin wave-3

# Final submission (60:00)
git add . && git commit -m "Final fixes" && git push
```

---

## 🏗️ **Technical Architecture**

### **Frontend Stack:**
- **Build System**: Gulp with BrowserSync live reloading
- **Template Engine**: LiquidJS for component-based HTML
- **Styling**: SCSS with BEM methodology 
- **JavaScript**: Vanilla ES6+ with class-based architecture
- **Data**: Static JSON files for products and categories

### **Development Setup:**
```bash
# Install dependencies
npm install

# Start development server
npx gulp default
# Server runs on http://localhost:5000

# Build for production  
npx gulp build
```

---

## 🏆 **Competition Rules & Judging**

### **Scoring Breakdown:**
- **Bug Fixes (70%)**: Points per bug based on difficulty
- **Code Quality (15%)**: Clean fixes vs. quick hacks
- **Features Restored (10%)**: Application functionality maintained
- **Wave Survival (5%)**: Bonus for completing all waves

### **Winner Categories:**
- 🧙 **App Whisperer**: Most total points  
- 🛡️ **Crash Survivor**: Survived all waves with working app
- 🔍 **Bug Hunter**: Found most hidden bonus bugs
- ⚡ **Speed Demon**: Most fixes in first 30 minutes

---

## 🎮 **Event Information**

**Event**: App-Ocalypse Debugging Survival Challenge  
**Venue**: Esya '25, IIIT-Delhi  
**Duration**: 60 minutes  
**Format**: In-person team competition  
**Team Size**: 2-3 members  

**Ready to survive the App-Ocalypse?** 🔥