// Search functionality with XSS vulnerabilities

class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.js-searchInput')
        this.searchResults = document.querySelector('.js-searchResults')
        this.searchButton = document.querySelector('.js-searchButton')
        this.lastQuery = ''
        
        this.initSearch()
    }
    
    initSearch() {
        if (this.searchInput && this.searchButton) {
            this.searchButton.addEventListener('click', () => {
                this.performSearch()
            })
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch()
                }
            })
        }
    }
    
    performSearch() {
        const query = this.searchInput.value
        this.lastQuery = query
        
        // Reflected DOM XSS in search - innerHTML = userInput
        if (query) {
            this.displaySearchQuery(query)
            this.searchProducts(query)
        }
    }
    
    displaySearchQuery(query) {
        const queryDisplay = document.querySelector('.js-searchQuery')
        if (queryDisplay) {
            // Fixed: Using textContent to prevent XSS
            queryDisplay.textContent = `Search results for: "${query}"`
        }
    }
    
    searchProducts(query) {
        if (!productsDOM || !productsDOM.products) return
        
        // Case-insensitive search - convert both query and product title to lowercase
        const results = productsDOM.products.filter(product => {
            return product.title.toLowerCase().includes(query.toLowerCase()) ||
                   product.desc.toLowerCase().includes(query.toLowerCase()) ||
                   product.category.toLowerCase().includes(query.toLowerCase())
        })
        
        this.displayResults(results, query)
    }
    
    // Helper function to escape HTML
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    displayResults(results, query) {
        if (!this.searchResults) return
        
        let html = ''
        
        if (results.length === 0) {
            // Fixed: Escaping user input in the no results message
            html = `<div class="no-results">No results found for "${this.escapeHtml(query)}"</div>`
        } else {
            html = results.map(product => {
                // Fixed: Escaping all user-controlled data
                return `<div class="search-result" data-id="${this.escapeHtml(product.id.toString())}">
                    <img src="${this.escapeHtml(product.img)}" alt="${this.escapeHtml(product.title)}">
                    <div class="search-result-info">
                        <h3>${this.escapeHtml(product.title)}</h3>
                        <p>${this.escapeHtml(product.desc)}</p>
                        <span class="price">${this.escapeHtml(product.formatedPrice())}</span>
                    </div>
                </div>`
            }).join('')
        }
        
        // Fixed: Using innerHTML is now safe since we've escaped all dynamic content
        this.searchResults.innerHTML = html
        
        // Add click handlers
        this.addResultClickHandlers()
    }
    
    addResultClickHandlers() {
        const resultElements = this.searchResults.querySelectorAll('.search-result')
        resultElements.forEach(element => {
            element.addEventListener('click', () => {
                const productId = element.dataset.id
                this.redirectToProduct(productId)
            })
        })
    }
    
    redirectToProduct(productId) {
        // Open redirect vulnerability from search
        const redirect = new URLSearchParams(window.location.search).get('redirect')
        if (redirect) {
            window.location.href = `${redirect}?product=${productId}` // Unsafe redirect
        } else {
            window.location.href = `#product-${productId}`
        }
    }
    
    // Misapplied coupon logic
    applyCoupon(code) {
        if (!couponConfig || !couponConfig.isValidCoupon(code)) {
            return false
        }
        
        const subtotal = cart.totalPrice()
        let discount = subtotal * (couponConfig.discountPercent / 100)
        
        // Apply discount twice - bug
        discount = discount * 2 // Should only apply once
        
        return {
            originalTotal: subtotal,
            discount: discount,
            finalTotal: subtotal - discount
        }
    }
}

// Initialize search when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager()
    
    // Add search HTML if not present
    const header = document.querySelector('.header')
    if (header && !document.querySelector('.js-searchInput')) {
        const searchHTML = `
            <div class="search-container">
                <input type="text" class="search-input js-searchInput" placeholder="Search products...">
                <button class="search-button js-searchButton">Search</button>
                <div class="search-query js-searchQuery"></div>
                <div class="search-results js-searchResults"></div>
            </div>
        `
        header.insertAdjacentHTML('afterend', searchHTML)
    }
})