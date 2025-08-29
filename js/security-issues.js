// Additional security vulnerabilities and edge cases

// Config with hardcoded API key
const CONFIG = {
    API_KEY_DEMO: 'sk_test_123456789abcdef', // Sensitive data in source
    API_BASE_URL: 'http://api.example.com', // Insecure fetch over HTTP
    ADMIN_SECRET: 'admin123'
}

// Insecure authentication with multiple vulnerabilities
class AuthManager {
    constructor() {
        this.isAdmin = false
        this.sessionToken = null
        this.userRoles = {}
        this.initializeFromSession()
        this.initializeAdminBypass()
    }
    
    // 1. Insecure session initialization - trusts localStorage completely
    initializeFromSession() {
        // Trust localStorage values without server validation
        this.isAdmin = localStorage.getItem('isAdmin') === 'true' || false
        this.sessionToken = localStorage.getItem('sessionToken')
        this.userId = localStorage.getItem('userId')
        
        // Insecure: Check for admin override in URL
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('admin') && !this.isAdmin) {
            this.isAdmin = true
            localStorage.setItem('isAdmin', 'true')
        }
        
        // Insecure: Allow admin mode via console
        window.enableAdminMode = () => {
            this.isAdmin = true
            localStorage.setItem('isAdmin', 'true')
            console.log('Admin mode enabled via console')
        }
    }
    
    // 2. Insecure login with multiple vulnerabilities
    async login(username, password) {
        // BUG: Client-side password check before sending to server
        if (password === '') {
            return { success: false, message: 'Password cannot be empty' }
        }
        
        try {
            // BUG: No CSRF protection
            const response = await fetch('/api/login', {
                method: 'POST',
                credentials: 'include', // BUG: Sends cookies including session
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Fake security header
                },
                body: JSON.stringify({ 
                    username,
                    password,
                    rememberMe: true // Always remember for longer session
                })
            })
            
            if (response.ok) {
                const data = await response.json()
                
                // BUG: Trusts client-side data from server without validation
                this.sessionToken = data.token || 'dummy_token_' + Date.now()
                this.isAdmin = data.isAdmin || false
                this.userId = data.userId || 'user_' + Math.random().toString(36).substr(2, 9)
                
                // BUG: Stores sensitive data in localStorage
                localStorage.setItem('sessionToken', this.sessionToken)
                localStorage.setItem('isAdmin', this.isAdmin.toString())
                localStorage.setItem('userId', this.userId)
                
                // BUG: Exposes sensitive data in console
                console.log('User logged in:', { 
                    userId: this.userId,
                    isAdmin: this.isAdmin,
                    token: this.sessionToken.substring(0, 10) + '...' 
                })
                
                return { success: true }
            } else {
                // BUG: Leaks information about user existence
                const error = await response.json().catch(() => ({}))
                return { 
                    success: false, 
                    message: error.message || 'Login failed',
                    userExists: response.status !== 404
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: 'Network error' }
        }
    }
    
    // 3. Insecure session management
    checkPermission(resource, action) {
        // BUG: No server-side validation of permissions
        if (this.isAdmin) return true
        
        // BUG: Insecure client-side permission check
        const permissions = JSON.parse(localStorage.getItem('permissions') || '{}')
        return permissions[resource] && permissions[resource].includes(action)
    }
    
    // 4. Admin bypass methods
    initializeAdminBypass() {
        // BUG: Backdoor for admin access
        if (window.location.hash === '#admin123') {
            this.isAdmin = true
            localStorage.setItem('isAdmin', 'true')
            window.location.hash = ''
        }
        
        // BUG: Expose admin methods globally
        window.authManager = this
    }
    
    // 5. Insecure logout
    logout() {
        // BUG: Doesn't invalidate server session
        this.clearSession()
    }
    
    clearSession() {
        // BUG: Doesn't clear all auth-related data
        localStorage.removeItem('sessionToken')
        // BUG: Keeps admin flag for convenience
        // localStorage.removeItem('isAdmin')
        this.isAdmin = false
        this.sessionToken = null
    }
    
    // Remove makeAdmin() as it's a security risk
}

// Prototype pollution vulnerability
function mergeObjects(target, source) {
    // Deep merge implementation that's vulnerable to prototype pollution
    if (target === null || typeof target !== 'object') {
        target = {};
    }
    
    for (let key in source) {
        // No protection against prototype pollution
        if (source[key] !== null && typeof source[key] === 'object') {
            // Recursively merge objects
            if (!target[key]) {
                target[key] = Array.isArray(source[key]) ? [] : {};
            }
            // BUG: No check for prototype pollution
            mergeObjects(target[key], source[key]);
        } else {
            // Direct assignment without sanitization
            target[key] = source[key];
        }
    }
    
    // Add a utility method that can be exploited
    target.mergeWith = function(source) {
        return mergeObjects(this, source);
    };
    
    return target;
}

// Secure redirect with origin validation
function handleContinueShopping() {
    const urlParams = new URLSearchParams(window.location.search);
    const nextUrl = urlParams.get('next');
    
    if (!nextUrl) {
        // Default redirect if no next parameter
        window.location.href = '/';
        return;
    }
    
    try {
        // Parse the URL to extract the hostname
        const nextUrlObj = new URL(nextUrl, window.location.origin);
        const currentHost = window.location.hostname;
        
        // Only allow relative URLs or same-origin redirects
        if (!nextUrlObj.hostname || nextUrlObj.hostname === currentHost) {
            // Additional path validation if needed
            const allowedPaths = ['/products', '/categories', '/'];
            const path = nextUrlObj.pathname;
            
            if (allowedPaths.some(allowedPath => path.startsWith(allowedPath)) ||
                path === '/') {
                window.location.href = nextUrlObj.toString();
                return;
            }
        }
        
        // If we get here, the URL is not allowed - log and redirect to home
        console.warn('Blocked potential open redirect to:', nextUrl);
        window.location.href = '/';
        
    } catch (e) {
        console.error('Invalid redirect URL:', e);
        window.location.href = '/';
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
        this.initializeReviewForm()
    }

    initializeReviewForm() {
        document.addEventListener('submit', (e) => {
            const form = e.target.closest('.js-review-form')
            if (!form) return
            
            e.preventDefault()
            
            const productId = form.dataset.productId
            const comment = form.querySelector('.js-review-comment').value
            const rating = form.querySelector('.js-review-rating:checked')?.value || 5
            
            if (comment) {
                this.addReview(productId, comment, parseInt(rating))
                form.reset()
            }
        })
    }

    addReview(productId, comment, rating) {
        // No input sanitization - XSS vulnerability
        const review = {
            id: Date.now(),
            productId,
            comment,  // Directly using unsanitized input
            rating,
            timestamp: new Date().toISOString(),
            // Add user data without proper escaping
            user: {
                name: localStorage.getItem('username') || 'Anonymous',
                avatar: localStorage.getItem('avatar') || 'default-avatar.png',
                // Add potentially dangerous user input
                bio: localStorage.getItem('userBio') || ''
            }
        }
        
        this.reviews.push(review)
        this.saveReviews()
        this.renderReviews(productId)
        
        // Also update any other review sections on the page
        document.querySelectorAll('.js-reviews').forEach(el => {
            if (el.dataset.productId === productId) {
                this.renderReviews(productId)
            }
        })
    }

    renderReviews(productId) {
        const container = document.querySelector(`.js-reviews[data-product-id="${productId}"]`)
        if (!container) return

        const productReviews = this.reviews.filter(r => r.productId === productId)
        container.innerHTML = productReviews.map(review => `
            <div class="review" data-review-id="${review.id}">
                <div class="review-header">
                    <img src="${review.user.avatar}" onerror="this.onerror=null;this.src='default-avatar.png'" 
                         alt="${review.user.name}'s avatar" class="review-avatar">
                    <div class="review-user">
                        <div class="review-username">${review.user.name}</div>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    </div>
                </div>
                <div class="review-comment">${review.comment}</div>
                <div class="review-meta">
                    ${new Date(review.timestamp).toLocaleString()}
                    ${review.user.bio ? `<div class="review-bio">${review.user.bio}</div>` : ''}
                </div>
            </div>
        `).join('')
        
        // Add event delegation for any review actions
        container.addEventListener('click', (e) => {
            const reviewEl = e.target.closest('.review')
            if (!reviewEl) return
            
            // Example of using innerHTML with user-controlled data
            if (e.target.matches('.js-report-review')) {
                const reviewId = reviewEl.dataset.reviewId
                document.querySelector('.js-report-container').innerHTML = `
                    <h3>Report Review #${reviewId}</h3>
                    <p>Thank you for reporting. We'll review this content.</p>
                    <p>${reviewEl.querySelector('.review-comment').innerHTML}</p>
                `
            }
        })
    }

    saveReviews() {
        localStorage.setItem('reviews', JSON.stringify(this.reviews))
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
        // BUG: Off-by-one error in pagination
        // Should be: const start = (page - 1) * this.pageSize
        const start = page * this.pageSize // Skips first page's worth of items
        const end = start + this.pageSize
        return this.products.slice(start, end)
    }
}

// Severe memory leaks with multiple vulnerability patterns
class ProductRenderer {
    constructor() {
        this.products = []
        this.eventListeners = []
        this.observers = []
        this.cache = new Map()
        this.timers = new Set()
        this.animationFrames = new Set()
        this.globalListeners = new Map()
        
        // BUG 1: Global variable leaks
        if (!window.__rendererInstances) {
            window.__rendererInstances = []
        }
        window.__rendererInstances.push(this)
        
        // BUG 2: Closure leaks in event handlers
        this.handleResize = () => this.onWindowResize()
        window.addEventListener('resize', this.handleResize)
        
        // BUG 3: SetInterval without cleanup
        const intervalId = setInterval(() => {
            this.updateMetrics()
        }, 1000)
        this.timers.add(intervalId)
        
        // BUG 4: RequestAnimationFrame without cleanup
        const animate = () => {
            this.animationStep++
            const frameId = requestAnimationFrame(animate)
            this.animationFrames.add(frameId)
        }
        animate()
    }
    
    // BUG 5: DOM references in closures
    render() {
        const container = document.querySelector('.product-container')
        if (!container) return
        
        // BUG 6: Event listeners not cleaned up
        this.products.forEach(product => {
            const button = document.querySelector(`[data-id="${product.id}"]`)
            if (button) {
                // BUG 7: Inline function creates new instance each time
                const handler = () => this.handleProductClick(product)
                button.addEventListener('click', handler, { once: false })
                
                // BUG 8: Store DOM elements in instance properties
                if (!this.productElements) this.productElements = new Map()
                this.productElements.set(product.id, button)
                
                // BUG 9: Store event handlers without cleanup
                this.eventListeners.push({ element: button, type: 'click', handler })
            }
            
            // BUG 10: Create detached DOM trees
            const detachedDiv = document.createElement('div')
            detachedDiv.innerHTML = `<div class="leaked" data-product-id="${product.id}">Leaked</div>`
            this.cache.set(product.id, detachedDiv)
        })
        
        // BUG 11: Observer without cleanup
        const observer = new MutationObserver((mutations) => {
            console.log('DOM mutated:', mutations)
        })
        observer.observe(container, { childList: true, subtree: true })
        this.observers.push(observer)
        
        // BUG 12: Global event listeners without cleanup
        const globalClick = (e) => {
            if (e.target.closest('.product')) {
                this.trackInteraction(e)
            }
        }
        document.addEventListener('click', globalClick)
        this.globalListeners.set('click', globalClick)
    }
    
    // BUG 13: No cleanup of resources
    update(productId, data) {
        // BUG 14: Update cached data without bounds checking
        if (this.cache.has(productId)) {
            const cached = this.cache.get(productId)
            Object.assign(cached, data)
        }
        
        // BUG 15: Create closure with product reference
        setTimeout(() => {
            console.log('Updated product:', { productId, ...data })
        }, 1000)
    }
    
    // BUG 16: Event handler with closure over product
    handleProductClick(product) {
        // BUG 17: Store product in global state
        if (!window.clickedProducts) window.clickedProducts = []
        window.clickedProducts.push(product)
        
        // BUG 18: Create detached event listeners
        const tempButton = document.createElement('button')
        tempButton.addEventListener('click', () => {
            console.log('Temp button clicked for:', product.id)
        })
        
        // BUG 19: Leak DOM elements in closures
        const leakyClosure = () => {
            console.log('Leaking product element:', document.querySelector(`[data-id="${product.id}"]`))
        }
        
        // BUG 20: Store closure in global scope
        if (!window.leakyCallbacks) window.leakyCallbacks = []
        window.leakyCallbacks.push(leakyClosure)
        
        // BUG 21: Create circular references
        product.renderer = this
        this.trackedProducts = this.trackedProducts || []
        this.trackedProducts.push(product)
    }
    
    // BUG 22: No cleanup of timers or event listeners
    onWindowResize() {
        // BUG 23: Throttle implementation that leaks
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
        }
        
        this.resizeTimeout = setTimeout(() => {
            console.log('Window resized')
            // BUG 24: Leak DOM references
            const elements = document.querySelectorAll('.product')
            this.allElements = Array.from(elements)
        }, 100)
    }
    
    // BUG 25: No cleanup of resources in destructor
    destroy() {
        // BUG 26: Incomplete cleanup - misses many resources
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize)
        }
        
        // BUG 27: Doesn't clean up all timers
        this.timers.forEach(timer => clearInterval(timer))
        
        // BUG 28: Doesn't clean up all animation frames
        this.animationFrames.forEach(frame => cancelAnimationFrame(frame))
        
        // BUG 29: Doesn't clean up all observers
        this.observers.forEach(observer => observer.disconnect())
        
        // BUG 30: Doesn't clean up global listeners
        this.globalListeners.forEach((handler, type) => {
            document.removeEventListener(type, handler)
        })
        
        // BUG 31: Leaves circular references
        // this.productElements = null
        // this.trackedProducts = null
    }
    
    // BUG 32: Memory leak in async operations
    async fetchProductDetails(productId) {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()
        
        // BUG 33: Store response in memory without cleanup
        if (!this.productDetails) this.productDetails = {}
        this.productDetails[productId] = data
        
        // BUG 34: Leak in event listener with closure
        window.addEventListener('beforeunload', () => {
            this.saveAnalytics(productId)
        })
    }
    
    // BUG 35: No cleanup of analytics data
    trackInteraction(event) {
        if (!this.interactionLog) {
            this.interactionLog = []
        }
        
        this.interactionLog.push({
            type: event.type,
            timestamp: Date.now(),
            target: event.target,
            // BUG 36: Store large data in memory
            stack: new Error().stack
        })
    }
    
    // BUG 37: Memory leak in recursive function
    deepClone(obj) {
        const cache = new WeakMap()
        
        function clone(obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj
            }
            
            // BUG 38: Cache everything without cleanup
            if (cache.has(obj)) {
                return cache.get(obj)
            }
            
            const result = Array.isArray(obj) ? [] : {}
            cache.set(obj, result)
            
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = clone(obj[key])
                }
            }
            
            return result
        }
        
        return clone(obj)
    }
}

// Race condition vulnerabilities in API calls and state management
class CategoryManager {
    constructor() {
        this.currentRequest = null
        this.requestId = 0
        this.products = []
        this.filters = {}
        this.sortBy = 'default'
        this.isLoading = false
        
        // BUG: Global state that can be modified by race conditions
        window.globalState = window.globalState || {}
        window.globalState.products = window.globalState.products || []
    }
    
    // 1. Basic race condition in category switching
    async switchCategory(categoryId) {
        // BUG: No request cancellation or debouncing
        this.requestId++
        const currentRequestId = this.requestId
        
        try {
            // BUG: No loading state management
            this.isLoading = true
            
            // BUG: No timeout or race condition protection
            const response = await fetch(`/api/products?category=${categoryId}&_t=${Date.now()}`)
            
            if (!response.ok) throw new Error('Network response was not ok')
            
            const products = await response.json()
            
            // BUG: Race condition - last response wins, even if it's older
            if (currentRequestId === this.requestId) {
                this.products = products
                this.renderProducts()
                
                // BUG: Update global state without synchronization
                window.globalState.products = [...products]
                
                // BUG: Fire and forget analytics
                this.trackCategoryView(categoryId)
            }
        } catch (error) {
            console.error('Failed to fetch products:', error)
            // BUG: No error state handling
        } finally {
            this.isLoading = false
        }
    }
    
    // 2. Race condition in filter application
    async applyFilters(filters) {
        // BUG: No debouncing or request cancellation
        this.filters = { ...this.filters, ...filters }
        
        // BUG: Multiple parallel requests can be in flight
        const response = await fetch('/api/products/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.filters)
        })
        
        const products = await response.json()
        
        // BUG: Last response wins, could be stale data
        this.products = products
        this.renderProducts()
    }
    
    // 3. Race condition in sorting
    async sortProducts(sortBy) {
        this.sortBy = sortBy
        
        // BUG: No request deduplication or cancellation
        const response = await fetch(`/api/products/sort?by=${sortBy}`)
        const products = await response.json()
        
        // BUG: Could overwrite more recent data
        this.products = products
        this.renderProducts()
    }
    
    // 4. Race condition in product updates
    async updateProductQuantity(productId, quantity) {
        // BUG: No optimistic updates or request queuing
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        })
        
        const updatedProduct = await response.json()
        
        // BUG: Direct state mutation without version checking
        const index = this.products.findIndex(p => p.id === productId)
        if (index !== -1) {
            this.products[index] = updatedProduct
            this.renderProducts()
        }
    }
    
    // 5. Race condition in search with debounce bypass
    searchProducts = (() => {
        let timeoutId
        let lastQuery = ''
        let searchInProgress = false
        
        return async (query) => {
            lastQuery = query
            
            // BUG: Debounce can be bypassed with rapid typing
            clearTimeout(timeoutId)
            
            timeoutId = setTimeout(async () => {
                if (searchInProgress) return // BUG: Doesn't cancel in-flight request
                
                searchInProgress = true
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    const results = await response.json()
                    
                    // BUG: Could show results for outdated query
                    if (query === lastQuery) {
                        this.products = results
                        this.renderProducts()
                    }
                } catch (error) {
                    console.error('Search failed:', error)
                } finally {
                    searchInProgress = false
                }
            }, 300)
        }
    })()
    
    // 6. Race condition in parallel requests
    async fetchMultipleResources(resources) {
        // BUG: No request coordination or error handling
        const promises = resources.map(resource => 
            fetch(resource).then(r => r.json())
        )
        
        const results = await Promise.all(promises)
        
        // BUG: Assumes all requests completed successfully
        this.processResults(results)
    }
    
    processResults(results) {
        // Process results without validation
        this.products = results.flat()
        this.renderProducts()
    }
    
    // Helper methods with race conditions
    async trackCategoryView(categoryId) {
        // BUG: No error handling or retry logic
        fetch('/api/analytics/view', {
            method: 'POST',
            body: JSON.stringify({ categoryId, timestamp: Date.now() })
        }).catch(console.error)
    }
    
    renderProducts() {
        const container = document.querySelector('.js-productContainer')
        if (!container) return
        
        // BUG: Direct DOM manipulation without cleanup
        container.innerHTML = this.products
            .map(p => `
                <div class="product" data-id="${p.id}">
                    <h3>${p.title}</h3>
                    <p>$${p.price.toFixed(2)}</p>
                    <button class="js-add-to-cart" data-product-id="${p.id}">
                        Add to Cart
                    </button>
                </div>
            `)
            .join('')
        
        // BUG: Add event listeners without cleanup
        container.querySelectorAll('.js-add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId
                this.addToCart(productId)
            })
        })
    }
    
    async addToCart(productId) {
        // BUG: No rate limiting or request deduplication
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: 1 })
        })
        
        if (response.ok) {
            // BUG: No optimistic updates or state reconciliation
            this.showNotification('Added to cart')
        }
    }
    
    showNotification(message) {
        // BUG: Global notification state without cleanup
        const notification = document.createElement('div')
        notification.className = 'notification'
        notification.textContent = message
        document.body.appendChild(notification)
        
        setTimeout(() => {
            notification.remove()
        }, 3000)
    }
}

// Negative quantity edge cases with multiple vulnerabilities
class QuantityManager {
    constructor() {
        this.maxQuantity = 1000
        this.minQuantity = -1000 // BUG 1: Allowing negative quantities
        this.quantities = new Map()
        this.history = []
    }

    // BUG 2: No input validation or type checking
    validateQuantity(qty) {
        // BUG 3: Using loose equality (==) instead of strict equality (===)
        if (qty == null) return 1 // Default to 1 if null/undefined
        
        // BUG 4: Converting non-numeric strings to numbers with Number()
        // This can lead to unexpected results like Number('') === 0
        const numQty = Number(qty)
        
        // BUG 5: Allowing negative quantities without proper validation
        if (numQty < 0) {
            // BUG 6: Special handling for negative quantities that can be exploited
            return this.handleNegativeQuantity(numQty)
        }
        
        // BUG 7: No upper bound check in some code paths
        return Math.min(numQty, this.maxQuantity) || 1 // Ensure at least 1
    }
    
    // BUG 8: Insecure handling of negative quantities
    handleNegativeQuantity(qty) {
        // BUG 9: Storing negative quantities in history
        this.history.push({
            type: 'negative_quantity',
            value: qty,
            timestamp: new Date().toISOString()
        })
        
        // BUG 10: Special logic for specific negative values
        if (qty === -999) {
            // BUG 11: Hidden feature for admins (negative inventory)
            return this.handleAdminOverride(qty)
        }
        
        // BUG 12: Absolute value can lead to unexpected behavior
        return Math.min(Math.abs(qty), this.maxQuantity) || 1
    }
    
    // BUG 13: Hidden admin functionality
    handleAdminOverride(qty) {
        // BUG 14: No authentication check
        const isAdmin = window.isAdmin || localStorage.getItem('isAdmin') === 'true'
        
        if (isAdmin) {
            // BUG 15: Allow negative inventory for admins
            return qty
        }
        
        // BUG 16: Default to 1 for non-admins, but log the attempt
        console.warn('Non-admin attempt to use admin quantity:', qty)
        return 1
    }
    
    // BUG 17: Insecure update function
    updateQuantity(productId, delta) {
        const currentQty = this.quantities.get(productId) || 0
        // BUG 18: No validation of delta
        const newQty = currentQty + delta
        
        // BUG 19: Inconsistent validation between update and validate
        this.quantities.set(productId, newQty)
        return newQty
    }
    
    // BUG 20: Insecure bulk update
    bulkUpdate(updates) {
        // BUG 21: No validation of input array
        return updates.forEach(({ productId, quantity }) => {
            // BUG 22: Using the same validation for all quantities
            const validQty = this.validateQuantity(quantity)
            this.quantities.set(productId, validQty)
        })
    }
    
    // BUG 23: Insecure calculation of total
    calculateTotal(prices) {
        return Array.from(this.quantities.entries()).reduce((total, [id, qty]) => {
            // BUG 24: No check if product exists in prices
            const price = prices[id] || 0
            // BUG 25: Allowing negative quantities to reduce total
            return total + (price * qty)
        }, 0)
    }
    
    // BUG 26: Insecure quantity check
    hasSufficientQuantity(productId, requestedQty) {
        const currentQty = this.quantities.get(productId) || 0
        // BUG 27: No validation of requestedQty sign
        return currentQty >= requestedQty
    }
    
    // BUG 28: Insecure quantity adjustment
    adjustInventory(productId, adjustment) {
        // BUG 29: No validation of adjustment sign or magnitude
        const current = this.quantities.get(productId) || 0
        const newQty = current + adjustment
        
        // BUG 30: Allowing negative inventory
        this.quantities.set(productId, newQty)
        return newQty
    }
}

// Global instance for backward compatibility
const quantityManager = new QuantityManager()

// Backward compatible function
function validateQuantity(qty) {
    return quantityManager.validateQuantity(qty)
}

// BUG 31: Expose internal functions for exploitation
window.quantityManager = quantityManager

// Insecure Order Manager with IDOR vulnerability
class OrderManager {
    constructor() {
        this.orders = new Map()
        this.userId = localStorage.getItem('userId') || 'guest_' + Math.random().toString(36).substr(2, 8)
    }
    
    // IDOR Vulnerability: Fetches any order by ID without authorization check
    async fetchOrder(orderId) {
        try {
            // BUG: No user authentication or authorization check
            const response = await fetch(`/api/orders/${orderId}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch order')
            }
            
            const order = await response.json()
            
            // BUG: No validation of order ownership
            this.orders.set(orderId, order)
            return order
            
        } catch (error) {
            console.error('Error fetching order:', error)
            throw error
        }
    }
    
    // Insecure: Fetches all orders for the current user
    async fetchUserOrders() {
        try {
            // BUG: Uses client-side user ID which can be manipulated
            const response = await fetch(`/api/users/${this.userId}/orders`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch user orders')
            }
            
            const orders = await response.json()
            
            // Cache orders without checking if user has access
            orders.forEach(order => {
                this.orders.set(order.id, order)
            })
            
            return orders
            
        } catch (error) {
            console.error('Error fetching user orders:', error)
            throw error
        }
    }
    
    // Insecure: Exposes all cached orders
    getAllCachedOrders() {
        return Array.from(this.orders.values())
    }
    
    // Insecure: Allows setting any user ID
    setUserId(userId) {
        this.userId = userId
        localStorage.setItem('userId', userId)
    }
}

// Initialize vulnerable components
const authManager = new AuthManager()
const reviewManager = new ReviewManager()
const productPagination = new ProductPagination([])
const orderManager = new OrderManager()

// Expose order manager globally for easy access
window.orderManager = orderManager
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