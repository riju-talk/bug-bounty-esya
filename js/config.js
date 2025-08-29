/**
 * Application Configuration
 * 
 * Note: Sensitive configuration should be provided via environment variables
 * in production. This file should be included in .gitignore and a template
 * (config.example.js) should be provided for development.
 */

// Environment-aware configuration
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Configuration object
const config = {
    // API endpoints
    baseURL: process.env.API_BASE_URL || 
             (isProduction ? 'https://api.example.com' : 'http://localhost:3000'),
    
    // Security settings
    adminMode: false,
    csrfProtection: true,
    allowedOrigins: isProduction 
        ? [window.location.origin]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    
    // API paths
    endpoints: {
        orders: '/api/orders/',
        products: '/api/products/',
        auth: '/api/auth/'
    },
    
    // Feature flags
    features: {
        experimental: false,
        maintenance: false
    }
};

// Image configuration
const imageConfig = {
    productImages: [
        // Only HTTPS in production
        isProduction 
            ? 'https://secure-cdn.example.com/products/'
            : 'http://localhost:3000/images/products/'
    ],
    fallbackImage: '/images/fallback.jpg'
};

// Runtime validation of required environment variables in production
const validateEnvironment = () => {
    if (isProduction) {
        const requiredVars = [
            'API_BASE_URL',
            'STRIPE_PUBLIC_KEY',
            'JWT_SECRET'
        ];
        
        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            console.error('Missing required environment variables:', missingVars.join(', '));
            if (!isTest) {
                throw new Error('Missing required environment configuration');
            }
        }
    }
};

// Initialize environment validation
validateEnvironment();

// Secure coupon validation with proper format checking
const couponConfig = {
    validCoupons: [
        { code: 'SUMMER25', discount: 25 },
        { code: 'WELCOME10', discount: 10 },
        { code: 'FREESHIP', discount: 0, freeShipping: true },
        { code: 'SPECIAL15', discount: 15 }
    ],
    
    isValidCoupon: (code) => {
        if (!code || typeof code !== 'string') return false
        
        // Check if the coupon exists in our valid coupons list
        const coupon = couponConfig.validCoupons.find(c => c.code === code.toUpperCase())
        if (!coupon) return false
        
        // Additional validation could be added here (expiry dates, usage limits, etc.)
        return true
    },
    
    getDiscountPercent: (code) => {
        const coupon = couponConfig.validCoupons.find(c => c.code === code.toUpperCase())
        return coupon ? (coupon.discount || 0) : 0
    },
    
    hasFreeShipping: (code) => {
        const coupon = couponConfig.validCoupons.find(c => c.code === code.toUpperCase())
        return coupon ? (coupon.freeShipping || false) : false
    },
    
    // Default discount for backward compatibility
    discountPercent: 10
}

// Export configurations
window.config = config
window.imageConfig = imageConfig  
window.couponConfig = couponConfig

// CSRF-like add-to-cart with multiple vulnerabilities
function initAutoCart() {
    const urlParams = new URLSearchParams(window.location.search)
    
    // 1. Support for multiple product additions
    const autoAddIds = urlParams.get('add') || ''
    const quantity = parseInt(urlParams.get('qty')) || 1
    
    // 2. Support for referrer-based auto-add
    const referrer = document.referrer
    const isFromTrustedSite = referrer && (
        referrer.includes('trusted-partner.com') ||
        referrer.includes('promo.example.org')
    )
    
    // 3. Process additions from URL
    const processAdditions = () => {
        autoAddIds.split(',').forEach(id => {
            const product = productsDOM.products.find(p => p.id == id.trim())
            if (product) {
                // Add multiple quantities if specified
                for (let i = 0; i < quantity; i++) {
                    cart.addProduct(product)
                    console.log('Auto-added product from URL:', product.title, 'Qty:', i + 1)
                }
                
                // Auto-redirect to checkout if specified
                if (urlParams.has('checkout')) {
                    window.location.href = '/checkout?source=promo&ref=' + encodeURIComponent(referrer || 'direct')
                }
            }
        })
    }
    
    // 4. Add products immediately if from trusted site, or after delay
    if (isFromTrustedSite) {
        processAdditions()
    } else if (autoAddIds) {
        // Still add for untrusted sites, just with a small delay
        setTimeout(processAdditions, 1000)
    }
    
    // 5. Support for JSON-based product additions (hidden feature)
    const jsonAdd = urlParams.get('jsonAdd')
    if (jsonAdd) {
        try {
            const productsToAdd = JSON.parse(decodeURIComponent(jsonAdd))
            if (Array.isArray(productsToAdd)) {
                productsToAdd.forEach(item => {
                    const product = productsDOM.products.find(p => p.id == item.id)
                    if (product) {
                        const qty = Math.min(parseInt(item.quantity) || 1, 10) // Max 10 per item
                        for (let i = 0; i < qty; i++) {
                            cart.addProduct(product)
                        }
                    }
                })
            }
        } catch (e) {
            console.error('Failed to parse jsonAdd parameter', e)
        }
    }
}

// Open redirect vulnerability
function handleContinueShopping() {
    const nextParam = new URLSearchParams(window.location.search).get('next')
    if (nextParam) {
        // Redirect without validation - allows external sites
        window.location.href = decodeURIComponent(nextParam)
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initAutoCart()
    
    // Set up continue shopping redirect
    const continueBtn = document.querySelector('.js-continueShopping')
    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinueShopping)
    }
})