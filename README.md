# Vanilla JavaScript Ecommerce - Bug Bounty Edition

This is a **deliberately vulnerable** version of the vanilla JavaScript ecommerce project, designed for bug bounty practice and security testing.

## ⚠️ WARNING ⚠️

This project contains **intentionally introduced security vulnerabilities and bugs**. It should NEVER be used in production or deployed to a public server. Use only in isolated development environments for educational purposes.

## Bug Categories Included

### Functional Bugs (16)
- Cart count desync (off-by-one error)
- Price rounding errors
- Quantity update issues
- Duplicate product rows
- Misapplied coupons
- Broken "Clear cart" functionality
- Search missing last item
- Wrong category filters
- Broken pagination
- Countdown timer issues
- Sticky header flicker
- Slider navigation bugs
- Featured button targeting
- FAQ toggle problems
- Frozen footer year
- Missing debounce on buttons

### Security Vulnerabilities (16)
- Reflected DOM XSS in search
- Stored XSS in reviews
- Product title HTML injection
- Insecure HTTP fetches
- CSRF-like add-to-cart
- LocalStorage trust issues
- Weak coupon validation
- Open redirect vulnerabilities
- Mixed content images
- Prototype pollution
- HTML injection in toasts
- Missing clickjacking protection
- Weak pseudo-authentication
- Hardcoded API keys
- IDOR vulnerabilities
- Service worker cache poisoning

### Hidden/Edge Case Issues (16)
- Negative quantity handling
- Floating-point arithmetic drift
- Fetch race conditions
- Timezone bugs in countdown
- Case-sensitive search
- Double text truncation
- Memory leaks from event listeners
- Stale cached data
- Null element scroll attempts
- Wrong currency symbols
- Accessibility regressions
- Broken back navigation
- Discount rounding bias
- Out-of-stock purchase bypass
- Category slug mismatches
- Persisted filter bugs

## Installation & Setup

```bash
git clone <repository>
cd vanilla-js-ecommerce
npm install
```

## Running the Project

```bash
gulp
```

Then visit `http://localhost:3000`

## Bug Hunting Guidelines

1. **Functional Testing**: Try normal user flows - adding items, using filters, navigation
2. **Security Testing**: Look for XSS, injection points, authentication bypasses
3. **Edge Cases**: Test with unusual inputs, rapid clicks, browser back/forward
4. **Code Review**: Examine JavaScript files for logic errors and security issues

## Key Files to Examine

- `js/products.js` - Main product and cart logic
- `js/header.js` - Navigation and cart display
- `js/security-issues.js` - Additional security vulnerabilities
- `js/accessibility-issues.js` - UX and accessibility problems
- `data/products.json` - Product data with injected payloads

## Scoring System

- **Critical Security Issues**: 100 points
- **High Functional Bugs**: 75 points  
- **Medium Issues**: 50 points
- **Low/Edge Cases**: 25 points

## Reporting Format

When reporting bugs, include:
1. **Category**: Functional/Security/Hidden
2. **Severity**: Critical/High/Medium/Low
3. **Location**: File and line number
4. **Description**: What the bug does
5. **Reproduction**: Steps to trigger
6. **Impact**: What could go wrong
7. **Fix**: How to resolve it

## Educational Purpose

This project demonstrates common web application vulnerabilities including:
- Client-side injection attacks
- Logic flaws in e-commerce flows
- Authentication and authorization issues
- Data validation problems
- Race conditions and timing issues
- Memory management problems
- Accessibility and UX anti-patterns

## License

MIT License - Educational use only. Not for production deployment.