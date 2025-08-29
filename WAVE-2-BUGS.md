# 🌊🌊🌊 Wave 2: Security Vulnerabilities (+9 bugs, +285 points)

## +30 Minutes - SECURITY BREACH! Critical Vulnerabilities

### 🛡️ **New Security Bugs Available in Wave 2**

| #  | Bug Name | File | Points | Difficulty | Description |
|----|----------|------|--------|------------|-------------|
| 18 | **Reflected DOM XSS in search** | `js/search.js` | 40 | High | innerHTML with unsanitized user query |
| 19 | **Product title HTML injection** | `data/products.json` | 35 | High | SVG onload payload in JSON product data |
| 20 | **Weak coupon validation** | `js/products.js` | 25 | Medium | Accepts any string with length > 0 |
| 21 | **LocalStorage trust** | `js/security-issues.js` | 30 | Medium | Client-side isAdmin flag trusted |
| 22 | **HTML injection in toasts** | `js/toast.js` | 35 | High | innerHTML with user-controlled strings |
| 23 | **Sensitive data in source** | `js/config.js` | 35 | High | Hardcoded API keys committed to repo |
| 24 | **Open redirect** | `js/config.js` | 40 | High | Unvalidated next parameter in redirects |
| 25 | **Countdown never stops** | `js/countdown.js` | 20 | Medium | clearInterval commented out |
| 26 | **Misapplied coupon** | `js/products.js` | 25 | Medium | Double discount application bug |

**Wave 2 New Total: +285 points**  
**Cumulative Total: 555 points (26 bugs)**

---

## 🎯 **How to Test Wave 2 Security Bugs**

### **🚨 CRITICAL: Reflected DOM XSS in Search** (40 points)
- Enter `<script>alert('XSS')</script>` in search box
- JavaScript executes, popup appears
- **Location**: `js/search.js` - search result display using innerHTML

### **🚨 CRITICAL: Product Title HTML Injection** (35 points)
- Look for products with HTML/JavaScript in titles
- Check `data/products.json` for malicious payloads
- **Location**: `data/products.json` - SVG onload payload in product data

### **Weak Coupon Validation** (25 points)
- Enter any random string as coupon code
- System accepts it if it has any length > 0
- **Location**: `js/products.js` - coupon validation logic

### **LocalStorage Trust Issue** (30 points)
- Open browser console, run: `localStorage.setItem('isAdmin', 'true')`
- Refresh page - gains admin privileges client-side
- **Location**: `js/security-issues.js` - authentication logic

### **HTML Injection in Toasts** (35 points)
- Trigger toast notifications with user input
- HTML tags get rendered instead of escaped
- **Location**: `js/toast.js` - message display logic

### **🚨 CRITICAL: Sensitive Data in Source** (35 points)
- View page source or inspect JavaScript files
- Find hardcoded API keys, passwords, etc.
- **Location**: `js/config.js` - exposed credentials

### **🚨 CRITICAL: Open Redirect** (40 points)
- Manipulate URL parameters: `?next=http://evil.com`
- Site redirects to external malicious URL
- **Location**: `js/config.js` - redirect handling

### **Countdown Never Stops** (20 points)
- Let countdown reach zero
- Timer continues running instead of stopping
- **Location**: `js/countdown.js` - clearInterval commented out

### **Misapplied Coupon** (25 points)
- Apply coupon, then modify cart
- Discount gets applied multiple times incorrectly
- **Location**: `js/products.js` - discount calculation

---

## 🚨 **Security Priority Guide**

### **IMMEDIATE ATTENTION (40+ points):**
1. **Reflected XSS** - Direct code execution risk
2. **Open Redirect** - Phishing/malware vector
3. **Product HTML Injection** - Persistent attacks

### **HIGH PRIORITY (30-35 points):**
4. **Hardcoded API Keys** - Data breach risk
5. **HTML Injection in Toasts** - Secondary XSS vector
6. **LocalStorage Trust** - Authentication bypass

### **MEDIUM PRIORITY (20-25 points):**
7. **Weak Coupon Validation** - Business logic flaw
8. **Misapplied Coupon** - Financial impact
9. **Countdown Never Stops** - Resource waste

---

## 💡 **Wave 2 Strategy**

**🚨 RED ALERT: SECURITY WAVE** 

This wave simulates a **real security breach**. These are vulnerabilities that could:
- Allow attackers to steal user data
- Execute malicious code in user browsers  
- Redirect users to malicious sites
- Bypass authentication systems
- Access sensitive business data

**Key Security Concepts:**
- **Input Sanitization**: Never trust user input
- **Output Encoding**: Escape HTML/JavaScript in display
- **Validation**: Server-side validation, not just client-side
- **Authentication**: Proper session management
- **Data Protection**: Never hardcode secrets

**Focus Strategy:**
1. Fix critical XSS vulnerabilities first (40+ points)
2. Remove hardcoded secrets immediately
3. Implement proper input validation
4. Test with malicious payloads to confirm fixes

**Next Wave:** Wave 3 arrives at **+45 minutes** with nightmare-level challenges!