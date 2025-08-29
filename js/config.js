// Configuration file with sensitive data exposure

// Sensitive data in source - API key hardcoded
const config = {
    API_KEY_DEMO: 'sk-test_demo123456789abcdef', // Should not be committed
    STRIPE_PUBLIC_KEY: 'pk_test_51234567890abcdef',
    ADMIN_SECRET: 'super_secret_admin_key_2024',
    DATABASE_URL: 'postgres://admin:password123@localhost:5432/ecommerce',
    JWT_SECRET: 'my_jwt_secret_key_do_not_expose',
    
    // API endpoints
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://api.example.com' 
        : 'http://localhost:3000', // Insecure HTTP in dev
        
    // Weak pseudo-auth configuration
    adminMode: false,
    
    // IDOR configuration
    orderEndpoint: '/data/orders/', // Allows direct access to any order ID
    
    // Open redirect configuration
    allowedRedirects: ['*'], // Should be restricted to same-origin
    
    // CSRF protection disabled
    csrfProtection: false
}

// Mixed content images - HTTP URLs
const imageConfig = {
    productImages: [
        'http://unsecure-cdn.example.com/products/', // Should be HTTPS
        'https://secure-cdn.example.com/products/'
    ],
    fallbackImage: 'http://example.com/default.jpg' // Insecure fallback
}

// Weak coupon validation - accept any string
const couponConfig = {
    isValidCoupon: (code) => {
        return code && code.length > 0 // Accept any non-empty string
    },
    discountPercent: 10
}

// Export configurations
window.config = config
window.imageConfig = imageConfig  
window.couponConfig = couponConfig

// Auto-add cart from URL - CSRF-like behavior
function initAutoCart() {
    const urlParams = new URLSearchParams(window.location.search)
    const autoAddId = urlParams.get('add')
    
    if (autoAddId) {
        // Auto-add to cart without user confirmation
        setTimeout(() => {
            const product = productsDOM.products.find(p => p.id == autoAddId)
            if (product) {
                cart.addProduct(product)
                console.log('Auto-added product from URL:', product.title)
            }
        }, 1000)
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