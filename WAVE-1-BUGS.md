# 🌊🌊 Wave 1: Complex Functional Bugs (+9 bugs, +155 points)

## +15 Minutes - Advanced Functional Issues

### ⚙️ **New Bugs Available in Wave 1** 

| #  | Bug Name | File | Points | Difficulty | Description |
|----|----------|------|--------|------------|-------------|
| 9  | **Quantity update skips zero** | `js/products.js` | 10 | Medium | >= 1 condition blocks zero quantities |
| 10 | **Duplicate product rows** | `js/products.js` | 20 | Medium | Always push to array, never merge existing items |
| 11 | **Wrong category filter** | `js/products.js` | 20 | Medium | Case mismatch in category comparison |
| 12 | **Broken pagination** | `js/security-issues.js` | 15 | Medium | page * size instead of (page-1)*size offset |
| 13 | **Sticky header flicker** | `js/header.js` | 15 | Medium | Inconsistent scroll threshold values |
| 14 | **Slider "Next" skips items** | `js/slider.js` | 20 | Medium | Double increment bug on navigation |
| 15 | **Missing debounce on add-btn** | `js/products.js` | 20 | Medium | Rapid clicks spam cart with duplicates |
| 16 | **Case-sensitive search** | `js/search.js` | 15 | Medium | Missing toLowerCase() normalization |
| 17 | **Truncated names double cut** | `js/accessibility-issues.js` | 20 | Medium | CSS truncation + JS substring = double cut |

**Wave 1 New Total: +155 points**  
**Cumulative Total: 270 points (17 bugs)**

---

## 🎯 **How to Test Wave 1 Bugs**

### **Quantity Update Skips Zero** (10 points)
- Try to set product quantity to 0 using input controls
- Input gets blocked at minimum 1 instead of allowing 0
- **Location**: `js/products.js` - quantity validation logic

### **Duplicate Product Rows** (20 points)
- Add same product to cart multiple times
- Creates separate rows instead of increasing quantity
- **Location**: `js/products.js` - cart item management

### **Wrong Category Filter** (20 points)
- Use category filter dropdown
- Some products don't appear due to case mismatch in filtering
- **Location**: `js/products.js` - category comparison logic

### **Broken Pagination** (15 points)
- Navigate through product pages
- Page calculations are off, items get skipped/duplicated
- **Location**: `js/security-issues.js` - pagination math

### **Sticky Header Flicker** (15 points)
- Scroll up and down the page
- Header appears/disappears inconsistently around scroll thresholds
- **Location**: `js/header.js` - scroll event handling

### **Slider "Next" Skips Items** (20 points)
- Use slider navigation arrows
- Next button skips items due to double increment
- **Location**: `js/slider.js` - navigation logic

### **Missing Debounce on Add-btn** (20 points)
- Rapidly click "Add to Cart" button multiple times
- Each click adds item instead of debouncing rapid clicks
- **Location**: `js/products.js` - button event handling

### **Case-sensitive Search** (15 points)
- Search with different capitalization ("iPhone" vs "iphone")
- Results vary based on case instead of being normalized
- **Location**: `js/search.js` - search comparison logic

### **Truncated Names Double Cut** (20 points)
- Look at products with long names
- Names get truncated twice (CSS + JavaScript) making them too short
- **Location**: `js/accessibility-issues.js` - text processing

---

## 💡 **Wave 1 Strategy**

Wave 1 introduces **complex functional issues** that require:
- Deeper understanding of JavaScript logic
- Testing user interaction flows
- Understanding of asynchronous behavior
- More time to debug and fix properly

**Key Skills:**
- Array manipulation and deduplication
- Event handling and debouncing
- String processing and normalization
- Mathematical calculations (pagination, indexing)

**Time Management:** You now have 26 bugs total. Focus on high-point bugs first, and don't get stuck on any single issue too long.

**Next Wave:** Wave 2 arrives at **+30 minutes** with critical security vulnerabilities!