# 🌊🌊🌊🌊 Wave 3: Nightmare-Level Challenges (+10 bugs, +395 points)

## +45 Minutes - TOTAL SYSTEM FAILURE! Expert Debugging Required

### ⚡ **New Nightmare Bugs Available in Wave 3**

| #  | Bug Name | File | Points | Difficulty | Description |
|----|----------|------|--------|------------|-------------|
| 27 | **Stored XSS in reviews** | `js/security-issues.js` | 45 | Critical | Persistent XSS in comment storage |
| 28 | **Prototype pollution** | `js/security-issues.js` | 50 | Critical | No key filtering in object merge |
| 29 | **CSRF-like add-to-cart** | `js/config.js` | 35 | High | URL parameter auto-adds items |
| 30 | **Weak pseudo-auth** | `js/security-issues.js` | 40 | High | localStorage authentication bypass |
| 31 | **IDOR fetch orders** | `js/security-issues.js` | 45 | Critical | Direct order ID access without validation |
| 32 | **Service worker cache poison** | `sw.js` | 50 | Critical | Overly broad cache patterns |
| 33 | **Fetch race condition** | `js/security-issues.js` | 40 | High | Last response wins, not latest request |
| 34 | **Memory leak on rebind** | `js/security-issues.js` | 35 | High | Event listeners never removed |
| 35 | **Floating-point drift** | `js/products.js` | 30 | High | Price calculations use floating arithmetic |
| 36 | **Negative qty edge case** | `js/security-issues.js` | 25 | Medium | Allows -1 input quantities |

**Wave 3 New Total: +395 points**  
**Cumulative Total: 950 points (36 bugs)**

---

## 🎯 **How to Test Wave 3 Nightmare Bugs**

### **🚨 CRITICAL: Stored XSS in Reviews** (45 points)
- Submit review with `<script>alert('Persistent XSS')</script>`
- Script executes for every user who views the page
- **Location**: `js/security-issues.js` - review storage/display

### **🚨 CRITICAL: Prototype Pollution** (50 points)
- Send JSON with `{"__proto__": {"polluted": true}}`
- Pollutes Object prototype, affects entire application
- **Location**: `js/security-issues.js` - object merge function

### **CSRF-like Add-to-Cart** (35 points)
- Create malicious link: `yoursite.com?autoAdd=productId`
- Victims unknowingly add items to cart when visiting
- **Location**: `js/config.js` - URL parameter processing

### **Weak Pseudo-Auth** (40 points)
- Authentication relies entirely on localStorage flags
- No server validation, easily bypassed
- **Location**: `js/security-issues.js` - authentication system

### **🚨 CRITICAL: IDOR Fetch Orders** (45 points)
- Change order ID in requests: `/api/orders/123` → `/api/orders/124`
- Access other users' order data without authorization
- **Location**: `js/security-issues.js` - API request handling

### **🚨 CRITICAL: Service Worker Cache Poison** (50 points)
- Service worker caches everything indiscriminately
- Malicious content persists across sessions
- **Location**: `sw.js` - cache strategy configuration

### **Fetch Race Condition** (40 points)
- Rapidly trigger multiple API requests
- Last completed request renders, not the latest initiated
- **Location**: `js/security-issues.js` - async request handling

### **Memory Leak on Rebind** (35 points)
- Repeatedly change pages/components
- Event listeners accumulate, never cleaned up
- **Location**: `js/security-issues.js` - event management

### **Floating-Point Drift** (30 points)
- Add products with prices like $9.99 + $0.01
- Results in $10.0000000001 due to floating arithmetic
- **Location**: `js/products.js` - price calculation logic

### **Negative Qty Edge Case** (25 points)
- Set quantity to -1 in product inputs
- System allows negative quantities without validation
- **Location**: `js/security-issues.js` - input validation

---

## ⚡ **Nightmare Priority Triage**

### **🔥 CRITICAL SYSTEMS DOWN (45-50 points):**
1. **Service Worker Cache Poison** (50pts) - Persistent across all users
2. **Prototype Pollution** (50pts) - Breaks entire JavaScript environment
3. **Stored XSS** (45pts) - Affects all subsequent users  
4. **IDOR Orders** (45pts) - Massive data breach potential

### **🚨 HIGH EMERGENCY (35-40 points):**
5. **Fetch Race Condition** (40pts) - Data integrity issues
6. **Weak Pseudo-Auth** (40pts) - Complete authentication bypass
7. **CSRF Add-to-Cart** (35pts) - Automated user exploitation
8. **Memory Leak** (35pts) - Performance degradation

### **⚠️ COMPLEX ISSUES (25-30 points):**
9. **Floating-Point Drift** (30pts) - Financial calculation errors
10. **Negative Qty Edge Case** (25pts) - Business logic violation

---

## 💡 **Wave 3 Survival Strategy**

**🚨 THIS IS IT - FINAL WAVE!**

You're facing **expert-level vulnerabilities** that require:

### **Advanced Concepts Required:**
- **Prototype Pollution**: Understanding JavaScript's prototype chain
- **Race Conditions**: Asynchronous programming and request ordering  
- **Memory Management**: Event listener cleanup and garbage collection
- **Service Workers**: Browser caching and persistence mechanisms
- **Floating-Point Arithmetic**: Precision issues in financial calculations

### **Debugging Techniques:**
- **Browser DevTools**: Memory tab, Network timing, Console errors
- **Code Tracing**: Following execution flow through complex async operations
- **State Inspection**: Understanding how prototype pollution affects objects
- **Performance Monitoring**: Identifying memory leaks and resource usage

### **Time Management (Final 15 Minutes):**
1. **Focus on Critical bugs first** (45-50 points) - Maximum impact
2. **Don't get stuck** on any single bug > 5 minutes
3. **Document your attempts** - partial credit for understanding
4. **Test your fixes** - Make sure you didn't break existing functionality

### **Team Coordination:**
- **Divide & Conquer**: Each member takes 2-3 bugs maximum
- **Cross-verify**: Have teammates test your fixes
- **Communicate findings**: Share insights about complex bugs

---

## 🏁 **Final Sprint Guidelines**

**With 36 total bugs available (950 points), you're in the endgame!**

**Victory Conditions:**
- **App Whisperer**: Most total points (aim for 600+ points)
- **Crash Survivor**: Website still functional after all fixes
- **Bug Hunter**: Find bonus hidden bugs for extra points

**Remember:** Clean, working fixes beat quick hacks. The judges will test your application functionality after time expires!

**YOU'VE GOT THIS! 🔥**

---

## 🎁 **Bonus Round Available**

After Wave 3, **12 additional hidden bugs** worth **330 bonus points** are available for expert hunters who finish early and want to push for the top score!

**Time remaining: 15 minutes until final submission!**