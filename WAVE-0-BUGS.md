# 🌊 Wave 0: Starter Bugs (8 bugs, 115 points)

## Event Start (00:00) - Basic Functional Issues

### 🔧 **Bugs Available in Wave 0**

| #  | Bug Name | File | Points | Difficulty | Description |
|----|----------|------|--------|------------|-------------|
| 1  | **Cart count desync** | `js/products.js` | 15 | Easy | Cart badge shows count-1 instead of actual count |
| 2  | **Price rounding error** | `js/products.js` | 10 | Easy | parseInt instead of parseFloat causes price truncation |
| 3  | **Year in footer frozen** | `js/global.js` | 5 | Easy | Footer shows hardcoded 2023 instead of current year |
| 4  | **FAQ toggle one-way** | `js/faqs.js` | 10 | Easy | FAQ only opens, never closes (add vs toggle) |
| 5  | **Search misses last item** | `js/products.js` | 15 | Easy | Off-by-one loop error skips final product |
| 6  | **Broken "Clear cart"** | `js/header.js` | 15 | Easy | Clears array but not localStorage, cart persists |
| 7  | **Featured buttons wrong target** | `js/featured.js` | 15 | Easy | All buttons scroll to #products instead of specific sections |
| 8  | **Wrong currency symbol** | `js/products.js` | 15 | Easy | Hardcoded INR format for all locales |

**Wave 0 Total: 115 points**

---

## 🎯 **How to Test These Bugs**

### **Cart Count Desync** (15 points)
- Add items to cart
- Notice cart badge shows wrong count (off by 1)
- **Location**: `js/products.js` - cart counter logic

### **Price Rounding Error** (10 points)  
- Look at product prices ending in decimals
- Prices get truncated instead of properly rounded
- **Location**: `js/products.js` - price formatting function

### **Year in Footer Frozen** (5 points)
- Scroll to footer
- Year shows "2023" instead of current year
- **Location**: `js/global.js` - footer year logic

### **FAQ Toggle One-Way** (10 points)
- Click FAQ questions
- They open but never close when clicked again
- **Location**: `js/faqs.js` - toggle functionality

### **Search Misses Last Item** (15 points)
- Search for products
- Last matching product in list won't appear in results
- **Location**: `js/products.js` - search loop logic

### **Broken "Clear Cart"** (15 points)
- Add items to cart, then clear cart
- Refresh page - items reappear (localStorage not cleared)
- **Location**: `js/header.js` - clear cart function

### **Featured Buttons Wrong Target** (15 points)
- Click "View Products", "View Categories", etc. buttons
- All scroll to products section instead of their intended targets
- **Location**: `js/featured.js` - scroll target logic

### **Wrong Currency Symbol** (15 points)
- All prices show INR format regardless of locale
- Should adapt to user's region
- **Location**: `js/products.js` - currency formatting

---

## 💡 **Wave 0 Strategy**

These are **warm-up bugs** designed to:
- Build team confidence
- Test basic debugging skills
- Establish workflow and Git habits
- Practice using browser developer tools

**Focus on:** Quick wins, establishing momentum, and getting comfortable with the codebase before more complex waves arrive!

**Next Wave:** Wave 1 arrives at **+15 minutes** with complex functional issues!