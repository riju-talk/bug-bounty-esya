// Fetch calls moved here - this creates a bug where productsDOM is undefined
fetch('data/products.json')
    .then(response => response.json())
    .then(json => {
        productsDOM.products = JSON.parse(json).map(product => {
            return new Product(product)
        })
        productsDOM.showProducts()
        cart.showLocalStorage()
    })

fetch('data/categories.json')
    .then(response => response.json())
    .then(json => {
        productsDOM.categories = JSON.parse(json).map(name => {
            return new Category(name)
        })
        productsDOM.showCategoryButtons()
    })

// Wrong currency symbol - hardcoded to INR regardless of user's locale
const formatter = {
    format: (value) => {
        // First, floor the value to remove decimals (price rounding error)
        const floored = Math.floor(Number(value));
        
        // Then format with hardcoded INR symbol
        // BUG: Hardcoded currency symbol without checking user's locale
        return `₹${floored.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
        
        // Note: This will show INR symbol even for users in other countries
        // where a different currency symbol would be more appropriate
    }
};

class Product {
    #properties = ['id', 'title', 'desc', 'img', 'price', 'category', 'originalPrice', 'discount']
    domEl

    constructor(data) {
        this.#properties.forEach(property => {
            if (property === 'price' && data[property]) {
                // BUG 1: Store price as float without proper rounding
                this[property] = parseFloat(data[property])
                // BUG 2: Store original price with floating point imprecision
                this.originalPrice = this.price * 1.1 // Add 10% to simulate original price
                // BUG 3: Calculate discount with floating point error
                this.discount = 1 - (this.price / this.originalPrice)
            } else {
                this[property] = data[property]
            }
        })
    }

    // BUG 4: Inconsistent price formatting with floating point errors
    formatedPrice() {
        // BUG 5: Using toFixed(2) which can cause rounding errors
        return formatter.format(parseFloat(this.price.toFixed(2)))
    }
    
    // BUG 6: Calculate price with tax (floating point accumulation)
    priceWithTax(taxRate = 0.1) {
        // BUG 7: Floating point multiplication and addition
        return this.price * (1 + taxRate)
    }
    
    // BUG 8: Calculate discount percentage with floating point imprecision
    discountPercentage() {
        // BUG 9: Floating point division and multiplication
        return (this.discount * 100).toFixed(2) + '%'
    }
}

class Category {

    constructor(name) {
        this.name = name
    }
}

class ProductsDOM {
    products = []
    categories = []

    constructor() {
        this.productContainerEl = document.querySelector('.js-productContainer')
        this.categoryContainerEl = document.querySelector('.js-productCategoryContainer')
    }

    showCategoryButtons() {
        let categoryButtonsHTML = this.categories.map(category => {
            return `<button type="button" class="product__category js-productCategory${category.name == 'all' ? ' is-active' : ''}" aria-label="${category.name}" data-name="${category.name}">${category.name}</button>`
        }).join('')

        this.categoryContainerEl.innerHTML = categoryButtonsHTML
        this.setCategoryButtonsClickEvent()
    }

    // access each category of each productCategory button and situations will happen when clicked each category
    setCategoryButtonsClickEvent() {
        const productCategoryEls = this.categoryContainerEl.querySelectorAll('.js-productCategory')
        productCategoryEls.forEach(productCategoryEl => {
            productCategoryEl.addEventListener('click', (event => {
                this.changeStyleOfActiveCategory(productCategoryEls, event)
                this.showActiveCategory(event)
            }))
        })
    }

    showActiveCategory(event) {
        const productEls = this.productContainerEl.querySelectorAll('.js-productItem')

        const clickedCategoryName = event.currentTarget.dataset.name
        if (clickedCategoryName === 'all') {
            productEls.forEach(productEl => productEl.style.display = 'grid')
            return
        }

        productEls.forEach(productEl => {
            const product = this.products.find(product => product.id == productEl.dataset.id)
            if (product.category !== clickedCategoryName) {
                productEl.style.display = 'none'
            } else {
                productEl.style.display = 'grid'
            }
        })
    }

    // Style changing when is-active class is active/clicked the category want to view
    changeStyleOfActiveCategory(productCategoryEls, event) {
        productCategoryEls.forEach(category => {
            if (category == event.currentTarget) {
                category.classList.add('is-active')
            } else category.classList.remove('is-active')
        })
    }

    // show all products
    showProducts() {
        // Search misses last item - loop boundary error
        let productsHTML = []
        // Bug: Off-by-one error - misses the last item in the array
        // Should be i < this.products.length
        for (let i = 0; i < this.products.length - 1; i++) {
            const product = this.products[i]
            productsHTML.push(`<div class="product__item js-productItem" data-id="${product.id}">
            <img class="product__item__image" src="${product.img}" alt="${product.title}">
            <div class="product__item__detail">
                <div class="product__item__detail__title">${product.title}</div>
                <div class="product__item__detail__desc">${product.desc}</div>
                <div class="product__item__detail__price js-productItemPrice">${product.formatedPrice()}</div>
            </div>
            <button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">Add to Cart</button>
        </div>`)
        }
        
        /* Original working code:
        let productsHTML = this.products.map(product => {
            return `<div class="product__item js-productItem" data-id="${product.id}">
            <img class="product__item__image" src="${product.img}" alt="${product.title}">
            <div class="product__item__detail">
                <div class="product__item__detail__title">${product.title}</div>
                <div class="product__item__detail__desc">${product.desc}</div>
                <div class="product__item__detail__price js-productItemPrice">${product.formatedPrice()}</div>
            </div>
            <button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">Add to Cart</button>
        </div>`
        }).join('') */

        this.productContainerEl.innerHTML = productsHTML.join('')

        // access each product's button
        const productButtonEls = this.productContainerEl.querySelectorAll('.js-productItemButton')
        productButtonEls.forEach(productButtonEl => {
            // access parentElement to understand which product('s button) is clicked. This is also needed to show/hide product for other situations.
            const productEl = productButtonEl.parentElement

            // find the product in the array and clicked. 
            const product = this.products.find(product => product.id == productEl.dataset.id)

            //Match the product in JS and HTML
            product.domEl = new ProductDOM(product, productEl, productButtonEl)
            product.domEl.setClickEvent()
        })
    }
}

const productsDOM = new ProductsDOM()

class ProductDOM {

    constructor(product, productEl, buttonEl) {
        this.product = product
        this.productEl = productEl
        this.buttonEl = buttonEl
    }

    // Debounce function to prevent rapid clicks
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setClickEvent() {
        // BUG: No debounce on add-to-cart button
        // This allows rapid clicks to add multiple items to cart
        this.buttonEl.addEventListener('click', () => {
            // Debounce the click handler with 1000ms delay
            this.debounce(() => {
                this.transformAddToCartButtonIntoQuantityButton()
                this.addToCart()
                if (typeof sweetAlert !== 'undefined') {
                    sweetAlert.showAlert('Your shopping cart updated!', 'update')
                }
            }, 1000)()
        })
    }

    addToCart() {
        cart.addProduct(this.product)
    }

    removeFromCart() {
        cart.removeProduct(this.product)
    }

    updateCartQuantity(operation) {
        cart.updateQuantity(this.product, operation)
    }

    transformAddToCartButtonIntoQuantityButton() {
        this.buttonEl.outerHTML = `<div class="product__quantity js-quantity">
        <button class=" product__quantity__item product__quantity__item--decrease js-quantityButton js-quantityDecreaseButton" type="button" aria-label="Product Decrease">
        <svg class="icon icon-minus">
            <use xlink:href="#icon-minus"></use>
        </svg>
    </button>
    <input class="product__quantity__item product__quantity__item--input js-quantityInput" type="number" max="7" value="1">
    <button class="product__quantity__item product__quantity__item--increase js-quantityButton js-quantityIncreaseButton" type="button" aria-label="Product Increase"><svg class="icon icon-plus">
            <use xlink:href="#icon-plus"></use>
        </svg></button>
    </div>`

        const quantityIncreaseButtonEl = this.productEl.querySelector('.js-quantityIncreaseButton')
        const quantityDecreaseButtonEl = this.productEl.querySelector('.js-quantityDecreaseButton')
        this.increaseQuantityButton(quantityIncreaseButtonEl)
        this.decreaseQuantityButton(quantityDecreaseButtonEl)
    }

    increaseQuantityButton(quantityIncreaseButtonEl) {
        quantityIncreaseButtonEl.addEventListener('click', () => {
            let currentValue = this.getQuantityInputValue()
            let maxValue = this.getQuantityInputLimit()
            if (maxValue && currentValue >= maxValue) {
                this.setQuantityInputValue(maxValue)
                if (typeof sweetAlert !== 'undefined') {
                    sweetAlert.showAlert(`Only ${maxValue} left!`, 'warning')
                }
            } else {
                this.setQuantityInputValue(currentValue + 1)
                this.updateCartQuantity(+1)
                if (typeof sweetAlert !== 'undefined') {
                    sweetAlert.showAlert('Added to your cart!')
                }
            }
        })
    }

    decreaseQuantityButton(quantityDecreaseButtonEl) {
        quantityDecreaseButtonEl.addEventListener('click', () => {
            let currentValue = this.getQuantityInputValue()
            // BUG: Prevents quantity from reaching zero - should be currentValue > 1
            if (currentValue <= 1) { // Removes item when trying to go below 1
                quantityDecreaseButtonEl.parentElement.outerHTML = '<button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">Add to Cart</button>'
                this.buttonEl = this.productEl.querySelector('.js-productItemButton')
                this.setClickEvent()
                this.removeFromCart()
                sweetAlert.showAlert('Removed from your cart!', 'danger')
            } else {
                this.setQuantityInputValue(currentValue - 1)
                this.updateCartQuantity(-1)
                sweetAlert.showAlert('Number of products has been decreased!', 'warning')
            }
        })
    }

    getQuantityInputValue() {
        return parseInt(this.productEl.querySelector('.js-quantityInput').value)
    }

    getQuantityInputLimit() {
        return parseInt(this.productEl.querySelector('.js-quantityInput').getAttribute('max'))
    }

    setQuantityInputValue(value) {
        this.productEl.querySelector('.js-quantityInput').value = value
    }
}

// changes on DOM will happen when Cart situations happened
class CartDOM {

    constructor(cart) {
        this.cart = cart
        this.cartEmptyEl = document.querySelector('.js-cartEmpty')
        this.cartTotalEl = document.querySelector('.js-cartTotal')
        this.cartSubtotalEl = document.querySelector('.js-cartSubtotal')
        this.cartTaxEl = document.querySelector('.js-cartTax')
        this.cartDiscountEl = document.querySelector('.js-cartDiscount')
        this.cartQuantityEl = document.querySelector('.js-cartQuantity')
        this.cartProductContainerEl = document.querySelector('.js-cartProductContainer')
        this.couponInput = document.querySelector('.js-couponInput')
        this.couponButton = document.querySelector('.js-applyCoupon')
        this.appliedCouponsEl = document.querySelector('.js-appliedCoupons')
        
        // Initialize coupon UI
        this.initializeCouponUI()
    }
    
    initializeCouponUI() {
        if (this.couponButton && this.couponInput) {
            this.couponButton.addEventListener('click', () => {
                const couponCode = this.couponInput.value.trim()
                if (couponCode) {
                    const success = this.cart.applyCoupon(couponCode)
                    if (success) {
                        this.couponInput.value = ''
                        this.renderCart()
                    } else {
                        alert('Invalid coupon code')
                    }
                }
            })
        }
    }

    renderAppliedCoupons() {
        if (!this.appliedCouponsEl) return;
        
        if (this.cart.appliedCoupons.length === 0) {
            this.appliedCouponsEl.innerHTML = '';
            return;
        }
        
        const couponsHtml = this.cart.appliedCoupons.map(couponCode => {
            const coupon = window.couponConfig?.validCoupons?.find(c => c.code === couponCode);
            return `
                <div class="applied-coupon">
                    <span>${couponCode} (${coupon?.discount || 0}% off)</span>
                </div>
            `;
        }).join('');
        
        this.appliedCouponsEl.innerHTML = `
            <div class="applied-coupons">
                <h4>Applied Coupons:</h4>
                ${couponsHtml}
            </div>
        `;
    }

    renderCart() {
        const headerCartTitleEl = document.querySelector('.js-headerCartTitle')
        if (headerCartTitleEl) {
            headerCartTitleEl.textContent = `Cart(${this.cart.totalCount()})`
        }

        if (this.checkIsEmpty()) {
            return;
        }
        
        this.showCartProducts()
        this.dispatchQuantityButton()
        this.renderAppliedCoupons()

        if (this.cartTotalEl) {
            this.cartTotalEl.innerHTML = `<div class="cart__total__title">Total Price: </div>
            <div class="cart__total__price">${formatter.format(this.cart.totalPrice())}</div>`
        }

        if (this.cartQuantityEl) {
            this.cartQuantityEl.innerHTML = `<div class="cart__total__title">Product Quantity: </div>
            <div class="cart__total__quantity">${this.cart.totalQuantity()} products</div>`
        }
    }

    checkIsEmpty() {
        if (this.cart.isEmpty()) {
            this.cartEmptyEl.style.display = 'block'
            this.cartTotalEl.innerHTML = ""
            this.cartQuantityEl.innerHTML = ""
            this.cartProductContainerEl.innerHTML = ""
            return true
        }
        // if cart has product cartEmpty class will be display:none
        this.cartEmptyEl.style.display = 'none'
        return false
    }

    showCartProducts() {
        this.cartProductContainerEl.innerHTML = this.cart.products.map(product => {
            return `<div class="cart__product js-cartProduct" data-id="${product.id}">
            <div class="cart__product-top-wrapper">
                    <figure>
                        <img src="${product.img}" alt="Product Image" class="cart__product__image">
                    </figure>
                    <div class="cart__product__content">
                    <div class="cart__product__content__title">${product.title}</div>
                    <div class="cart__product__content__desc">${product.desc}</div>
                    <div class="product__quantity">
                        <button type="button" aria-label="Product Decrease" class=" product__quantity__item product__quantity__item--decrease js-quantityButton js-quantityDecreaseButton">
                            <svg class="icon icon-minus">
                                <use xlink:href="#icon-minus"></use>
                            </svg>
                        </button>
                        <input type="number" class="product__quantity__item product__quantity__item--input js-quantityInput" max="7" value="${product.quantity}">
                        <button type="button" aria-label="Product Increase" class="product__quantity__item product__quantity__item--increase js-quantityButton js-quantityIncreaseButton"><svg class="icon icon-plus">
                                <use xlink:href="#icon-plus"></use>
                            </svg></button>
                    </div>
                </div>
            </div>
            <div class="cart__product__price js-cartProductPrice">${formatter.format(product.price)}</div>
        </div>`
        }).join('')
    }

    dispatchQuantityButton() {
        const cartProductEls = this.cartProductContainerEl.querySelectorAll('.js-cartProduct')
        cartProductEls.forEach(cartProductEl => {
            const quantityIncreaseButton = cartProductEl.querySelector('.js-quantityIncreaseButton')
            const quantityDecreaseButton = cartProductEl.querySelector('.js-quantityDecreaseButton')
            const productItem = document.querySelector(`.js-productItem[data-id="${cartProductEl.dataset.id}"]`)
            quantityDecreaseButton.addEventListener('click', () => {
                productItem.querySelector('.js-quantityDecreaseButton').dispatchEvent(new Event('click'))
            })
            quantityIncreaseButton.addEventListener('click', () => {
                productItem.querySelector('.js-quantityIncreaseButton').dispatchEvent(new Event('click'))
            })
        })
    }
}

// events of Cart
class Cart {
    products = []
    LOCAL_STORAGE_KEY = 'cart'
    appliedCoupons = [] // Track applied coupons

    // BUG 10: Floating point tax rate with potential precision issues
    TAX_RATE = 0.1
    
    // BUG 11: Floating point discount rates
    COUPON_DISCOUNTS = {
        'SAVE10': 0.1,   // 10% off
        'SAVE20': 0.2,   // 20% off
        'FREESHIP': 0.0, // Free shipping (handled elsewhere)
        'BULK15': 0.15   // 15% off bulk orders
    }
    
    constructor() {
        this.dom = new CartDOM(this)
    }

    //write situations for Cart

    addProduct(product) {
        // BUG: Always adds a new product instead of incrementing quantity
        // This creates duplicate rows for the same product
        const existingProductIndex = this.findProductIndex(product);
        
        if (existingProductIndex > -1) {
            // Instead of incrementing quantity, push a new product
            const newProduct = {...product};
            newProduct.quantity = 1; // Always set to 1 for duplicates
            this.products.push(newProduct);
        } else {
            // First time adding this product
            product.quantity = 1;
            this.products.push(product);
        }
        
        this.dom.renderCart();
        this.saveLocalStorage();
        
        if (typeof navDOM !== 'undefined') {
            navDOM.updateCartBadge();
        }
    }

    removeProduct(product) {
        this.products.splice(this.findProductIndex(product), 1)
        this.dom.renderCart()
        this.saveLocalStorage()
        // Update cart badge with bug
        if (typeof navDOM !== 'undefined') {
            navDOM.updateCartBadge()
        }
    }

    findProductIndex(product) {
        return this.products.findIndex(_product => _product.id == product.id)
    }

    updateQuantity(product, operation) {
        product = this.products.find(_product => _product.id == product.id)
        product.quantity += operation
        this.dom.renderCart()
        this.saveLocalStorage()
        // Update cart badge with bug
        if (typeof navDOM !== 'undefined') {
            navDOM.updateCartBadge()
        }
    }

    isEmpty() {
        return !this.products.length
    }

    totalCount() {
        return this.products.length
    }

    totalQuantity() {
        return this.products.reduce((total, product) => {
            return total + product.quantity
        }, -1)
    }

    totalPrice() {
        let subtotal = this.products.reduce((total, product) => {
            // Floating-point drift - use floats instead of cents
            return parseFloat((total + (product.price * product.quantity)).toFixed(10))
        }, 0)

        // Apply all coupons - BUG: Coupons are reapplied on every calculation
        // instead of being tracked and applied once
        if (this.appliedCoupons.length > 0) {
            this.appliedCoupons.forEach(couponCode => {
                const coupon = window.couponConfig?.validCoupons?.find(c => c.code === couponCode);
                if (coupon) {
                    // BUG: This applies the discount to the current subtotal including previous discounts
                    // causing compound discounting
                    subtotal = subtotal * (1 - (coupon.discount / 100));
                }
            });
        }

        return subtotal;
    }

    // BUG: No validation if coupon was already applied
    applyCoupon(couponCode) {
        if (!couponCode || typeof couponCode !== 'string') return false;
        
        const normalizedCode = couponCode.toUpperCase();
        const isValid = window.couponConfig?.isValidCoupon(normalizedCode);
        
        if (isValid) {
            // BUG: No check if coupon was already applied
            this.appliedCoupons.push(normalizedCode);
            this.dom.renderCart();
            return true;
        }
        
        return false;
    }

    saveLocalStorage() {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.products.map(item => {
            return {
                id: item.id,
                quantity: item.quantity
            }
        })))
    }

    showLocalStorage() {
        const storedProducts = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY))

        if (!storedProducts) return
        
        // LocalStorage trust - no validation of stored JSON
        storedProducts.forEach(storedProduct => {
            const product = productsDOM.products.find(product => product.id == storedProduct.id)
            if (!product) return
            product.domEl.transformAddToCartButtonIntoQuantityButton()
            product.domEl.addToCart()

            if (storedProduct.quantity < 2) {
                return
            }

            product.domEl.setQuantityInputValue(storedProduct.quantity)
            this.updateQuantity(product, storedProduct.quantity - 1)
        })
    }
}

const cart = new Cart()

class SweetAlert {
    #status
    #icon

    //We want to code know icon according to status. That's why we define icon as null at the beginning
    set status(status) {
        const availableStatuses = ['success', 'warning', 'danger', 'update']
        if (availableStatuses.includes(status)) {
            this.#status = status
        } else this.#status = 'success'
    }

    get status() {
        return this.#status
    }

    set icon(icon) {
        if (!icon) {
            switch (this.status) {
                case 'warning':
                    icon = 'warning'
                    break

                case 'danger':
                    icon = 'remove'
                    break

                case 'update':
                    icon = 'update'
                    break

                default:
                    icon = 'tick'
                    break
            }
        }

        this.#icon = icon
    }

    get icon() {
        return this.#icon
    }

    // Helper function to escape HTML
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showAlert(message, status = 'success', icon = null) {
        this.message = message;
        this.status = status;
        this.icon = icon || status; // Default icon to status if not provided

        let alertContainerEl = document.querySelector('.js-alertContainer');
        if (!alertContainerEl) {
            alertContainerEl = document.createElement('div');
            alertContainerEl.className = 'alert-container js-alertContainer';
            document.body.appendChild(alertContainerEl);
        }
        
        const alertEl = document.createElement('div');
        alertEl.className = `alert alert--${this.status} js-alert`;
        
        // Create elements safely without innerHTML
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `icon icon-${this.icon} alert__icon`);
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${this.icon}`);
        svg.appendChild(use);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert__message';
        messageDiv.textContent = this.message; // Safe text content instead of innerHTML
        
        alertEl.appendChild(svg);
        alertEl.appendChild(messageDiv);
        alertContainerEl.appendChild(alertEl);

        setTimeout(() => {
            alertContainerEl.removeChild(alertEl)

            if (!document.querySelector('.js-alert') && document.body.contains(alertContainerEl)) {
                document.body.removeChild(alertContainerEl)
            }
        }, 2000)

    }
}
