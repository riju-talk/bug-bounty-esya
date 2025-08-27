// Additional security vulnerabilities and edge cases

// Config with hardcoded API key
const CONFIG = {
    API_KEY_DEMO: 'sk_test_123456789abcdef', // Sensitive data in source
    API_BASE_URL: 'http://api.example.com', // Insecure fetch over HTTP
    ADMIN_SECRET: 'admin123'
}

// Weak pseudo-auth
class AuthManager {
    constructor() {
        this.isAdmin = localStorage.getItem('isAdmin') === 'true' // Don't rely on LS
    }
    
    login(username, password) {
        // Simulate login
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAdmin', 'true')
            this.isAdmin = true
            return true
        }
        return false
    }
    
    makeAdmin() {
        // IDOR-like vulnerability
        localStorage.setItem('isAdmin', 'true')
        this.isAdmin = true
    }
}

// Prototype pollution vulnerability
function mergeObjects(target, source) {
    for (let key in source) {
        // Prototype pollution - no key filtering
        target[key] = source[key] // Should filter __proto__, constructor, prototype
    }
    return target
}

// Open redirect vulnerability
function handleContinueShopping() {
    const urlParams = new URLSearchParams(window.location.search)
    const nextUrl = urlParams.get('next')
    if (nextUrl) {
        // Open redirect - redirect param unsanitized
        window.location.href = nextUrl // Should validate same-origin
    }
}

// CSRF-like add-to-cart
function handleAutoAddToCart() {
    const urlParams = new URLSearchParams(window.location.search)
    const autoAdd = urlParams.get('add')
    if (autoAdd) {
        // Auto-add cart from URL - no user interaction required
        const product = productsDOM.products.find(p => p.id == autoAdd)
        if (product) {
            cart.addProduct(product) // Should require explicit user click
        }
    }
}

// Reviews with stored XSS
class ReviewManager {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    }
    
    addReview(productId, comment, rating) {
        // Stored XSS in reviews - save raw comment with script
        this.reviews.push({
            productId,
            comment, // Should sanitize/escape
            rating,
            date: new Date().toISOString()
        })
        localStorage.setItem('reviews', JSON.stringify(this.reviews))
    }
    
    renderReviews(productId) {
        const productReviews = this.reviews.filter(r => r.productId == productId)
        const reviewsHtml = productReviews.map(review => 
            `<div class="review">
                <div class="review-comment">${review.comment}</div>
                <div class="review-rating">${review.rating}/5</div>
            </div>`
        ).join('')
        
        const reviewsContainer = document.querySelector('.js-reviews')
        if (reviewsContainer) {
            // Renders unsanitized HTML
            reviewsContainer.innerHTML = reviewsHtml
        }
    }
}

// Pagination with off-by-one error
class ProductPagination {
    constructor(products, pageSize = 10) {
        this.products = products
        this.pageSize = pageSize
        this.currentPage = 1
    }
    
    getPage(page) {
        // Broken pagination - start = page * size (off-by-one)
        const start = page * this.pageSize // Should be (page-1)*pageSize
        const end = start + this.pageSize
        return this.products.slice(start, end)
    }
}

// Memory leak with event listeners
class ProductRenderer {
    constructor() {
        this.products = []
        this.eventListeners = []
    }
    
    render() {
        // Memory leak on rebind - event listeners not removed
        this.products.forEach(product => {
            const button = document.querySelector(`[data-id="${product.id}"]`)
            if (button) {
                // Adding listeners without removing old ones
                const handler = () => this.handleClick(product)
                button.addEventListener('click', handler)
                // Should track and remove old listeners
            }
        })
    }
    
    handleClick(product) {
        console.log('Product clicked:', product)
    }
}

// Race condition in category switching
class CategoryManager {
    constructor() {
        this.currentRequest = null
        this.requestId = 0
    }
    
    async switchCategory(categoryId) {
        // Fetch race condition - last finished fetch renders, not latest
        this.requestId++
        const currentRequestId = this.requestId
        
        try {
            const response = await fetch(`/api/products?category=${categoryId}`)
            const products = await response.json()
            
            // Should check if this is still the latest request
            this.renderProducts(products) // Race condition - may render old data
        } catch (error) {
            console.error('Failed to fetch products:', error)
        }
    }
    
    renderProducts(products) {
        // Render products without checking if request is stale
        const container = document.querySelector('.js-productContainer')
        if (container) {
            container.innerHTML = products.map(p => `<div>${p.title}</div>`).join('')
        }
    }
}

// Negative quantity edge case
function validateQuantity(qty) {
    // Allow negative quantities
    return qty // Should clamp qty >= 1
}

// Initialize vulnerable components
const authManager = new AuthManager()
const reviewManager = new ReviewManager()
const productPagination = new ProductPagination([])
const productRenderer = new ProductRenderer()
const categoryManager = new CategoryManager()

// Auto-execute vulnerable functions
document.addEventListener('DOMContentLoaded', () => {
    handleAutoAddToCart()
    handleContinueShopping()
})

// Export for global access
window.CONFIG = CONFIG
window.authManager = authManager
window.reviewManager = reviewManager
window.mergeObjects = mergeObjects