// Accessibility and UX issues

// Accessibility regression - div used as button
function createFakeButton() {
    const fakeButton = document.createElement('div')
    fakeButton.className = 'fake-button'
    fakeButton.textContent = 'Click me'
    fakeButton.style.cursor = 'pointer'
    
    // Missing: role="button", tabindex="0", keyboard event handlers
    fakeButton.addEventListener('click', () => {
        console.log('Fake button clicked')
    })
    
    return fakeButton
}

// Broken back navigation - filters don't push state
class FilterManager {
    constructor() {
        this.activeFilters = {}
        this.setupFilters()
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.js-filter')
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter
                const filterValue = e.target.dataset.value
                
                this.activeFilters[filterType] = filterValue
                this.applyFilters()
                
                // Missing: history.pushState for back navigation
                // Should update URL and handle popstate
            })
        })
    }
    
    applyFilters() {
        // Apply filters without updating browser history
        console.log('Applying filters:', this.activeFilters)
        
        // Persisted filters stuck - localStorage filter
        localStorage.setItem('filters', JSON.stringify(this.activeFilters))
        // Old filter persists after reload - should validate
    }
}

// Fixed: Removed JavaScript truncation to prevent double truncation with CSS
function truncateProductName(name) {
    // Return the full name and let CSS handle truncation with text-overflow
    return name;
}

// Out-of-stock still purchasable
class StockManager {
    constructor() {
        this.stock = {
            1: 0, // Out of stock
            2: 5,
            3: 2
        }
    }
    
    isInStock(productId) {
        return this.stock[productId] > 0
    }
    
    addToCart(productId) {
        // UI disables button only - programmatic add works
        // Should enforce check in logic
        const product = productsDOM.products.find(p => p.id == productId)
        if (product) {
            cart.addProduct(product) // No stock check
            return true
        }
        return false
    }
}

// Category slug mismatch
function normalizeCategory(category) {
    // Compare "Women's Wear" vs womens-wear
    // Should normalize to slug format
    return category // Missing normalization
}

// Stale related products
class RelatedProductsManager {
    constructor() {
        this.cachedRelated = {}
    }
    
    getRelatedProducts(productId) {
        // Cached once, never recomputed
        if (this.cachedRelated[productId]) {
            return this.cachedRelated[productId] // Stale data
        }
        
        const related = this.computeRelated(productId)
        this.cachedRelated[productId] = related
        return related
    }
    
    computeRelated(productId) {
        // Compute related products
        return productsDOM.products.slice(0, 3)
    }
    
    // Missing: method to recalculate on filter change
}

// Initialize accessibility issues
const filterManager = new FilterManager()
const stockManager = new StockManager()
const relatedProductsManager = new RelatedProductsManager()

// Add fake buttons to DOM
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container')
    if (container) {
        const fakeButton = createFakeButton()
        container.appendChild(fakeButton)
    }
})

// Export for global access
window.filterManager = filterManager
window.stockManager = stockManager
window.relatedProductsManager = relatedProductsManager
window.truncateProductName = truncateProductName
window.normalizeCategory = normalizeCategory