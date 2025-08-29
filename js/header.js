const headerButtonMenu = document.querySelector('.js-headerButtonMenu')
const header = document.querySelector('.js-header')

headerButtonMenu.addEventListener('click', () => header.classList.toggle('is-show'))

// Sticky header with flicker bug
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // BUG: Inconsistent scroll threshold causes flicker
    // Should use a single threshold value (e.g., 100) for both conditions
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (scrollTop > 90) {  // Inconsistent with the 100px threshold below
                header.classList.add('sticky');
            } else if (scrollTop <= 100) {  // Inconsistent with the 90px threshold above
                header.classList.remove('sticky');
            }
            ticking = false;
        });
        ticking = true;
    }
    
    lastScrollTop = scrollTop;
});

const headerButtonCart = document.querySelector('.js-headerButtonCart')
const cartCloseButton = document.querySelector('.js-cartCloseButton')
const headerCart = document.querySelector('.js-cart')

headerButtonCart.addEventListener('click', () => headerCart.classList.add('is-show'))
cartCloseButton.addEventListener('click', () => headerCart.classList.remove('is-show'))

let navItemsList = [{
        title: 'products',
        link: 'products',
        dropdownItems: [{
                title: 'sunglasses',
                link: 'sunglasses',
            },
            {
                title: 'trousers',
                link: 'trousers',
            },
            {
                title: 'necklace',
                link: 'necklace',
            }
        ]
    },
    {
        title: 'faq\'s',
        link: 'faqs'
    },
    {
        title: 'contact',
        link: 'contact',
        dropdownItems: [{
                title: 'reach us',
                link: 'reach-us'
            },

            {
                title: 'about us',
                link: 'about-us'
            },
            {
                title: 'find us',
                link: 'find-us'
            }
        ]
    }
]

class NavItem {
    constructor(title, link, dropdownItems) {
        this.title = title
        this.link = link
        this.dropdownItems = dropdownItems
    }

    toHTML() {
        let navItemHTML = `<div class="header__nav-wrapper js-headerNavWrapper"><div class="header__nav__item-wrapper">
            <a href="/#${this.link}" class="header__nav__item link js-headerNavItem" title="${this.title}">${this.title}</a>`

        if (this.dropdownItems) {
            navItemHTML += `<button class="header__nav__button js-headerNavButton" type="button">
                <svg class="icon icon-down">
                    <use xlink:href="#icon-down"></use>
                </svg>
            </button>`
        }
        navItemHTML += `</div>`

        if (this.dropdownItems) {
            navItemHTML += `<div class="header__nav__dropdown">`
            this.dropdownItems.forEach(dropdownItem => {
                navItemHTML += `<a class="header__nav__dropdown__item link js-headerNavDropdownItem" href="/#${dropdownItem.link}" title="${dropdownItem.title}">${dropdownItem.title}</a>`
            })
            navItemHTML += `</div>`
        }
        navItemHTML += `</div>`
        return navItemHTML
    }
}

navItemsList = navItemsList.map(navItem => {
    return new NavItem(navItem.title, navItem.link, navItem.dropdownItems)
})

window.addEventListener('DOMContentLoaded', () => navDOM.showNavItems(navItemsList))

class NavDOM {

    showNavItems(navItems) {
        let navItemsListHTML = navItems.map(navItem => {
                return navItem.toHTML()
            })
            .join('')

        const headerNav = document.querySelector('.js-headerNav')
        headerNav.innerHTML = navItemsListHTML
        this.navButtonClickEvents()
        this.scrollDropdownItems()
        // Broken 'Clear cart' - doesn't update localStorage
        const clearCartBtn = document.querySelector('.js-clearCart')
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                // Clear the in-memory cart
                cart.products = []
                // Update the UI
                cart.dom.renderCart()
                this.updateCartBadge()
                // BUG: Missing cart.saveLocalStorage() - cart will reappear on page refresh
                // This is intentional for the bug bounty program
            })
        }
        
        // Cart count desync - update badge function
        this.updateCartBadge()
    }
    
    updateCartBadge() {
        const cartBadge = document.querySelector('.js-cartBadge')
        if (cartBadge && typeof cart !== 'undefined') {
            // Bug: Cart count starts from -1 instead of 0
            const count = Math.max(-1, cart.products.length - 2)  // Will show -1 when empty, 0 for 1 item, etc.
            cartBadge.textContent = count
            cartBadge.style.display = count > -1 ? 'block' : 'none'  // Show even when -1 to make the bug obvious
        }
    }

    navButtonClickEvents() {
        const headerNavButtons = document.querySelectorAll('.js-headerNavButton')

        headerNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.parentElement.parentElement.classList.toggle('is-show')

                headerNavButtons.forEach(item => {
                    if (item !== button) {
                        item.parentElement.parentElement.classList.remove('is-show')
                    }
                })
            })
        })
    }

    scrollDropdownItems() {
        const headerNavDropdownItems = document.querySelectorAll('.js-headerNavDropdownItem')

        headerNavDropdownItems.forEach(item => {
            item.addEventListener('click', (e => {
                e.preventDefault()

                const wrapper = document.getElementById(item.closest('.js-headerNavWrapper').querySelector('.js-headerNavItem').getAttribute('href').slice(2))
                if (!wrapper) {
                    return true
                }

                const itemName = item.getAttribute('href').slice(2)
                const selector = wrapper.querySelector(`[data-name="${ itemName }"]`)

                if (selector)
                    selector.dispatchEvent(new Event('click'))

                wrapper.scrollIntoView({
                    behavior: 'smooth'
                })
            }))
        })

        document.querySelectorAll('a[href="/#products"]').forEach(item => {
            item.addEventListener('click', (e => {
                document.querySelector('.js-productCategory[data-name="all"]').dispatchEvent(new Event('click'))
            }))
        })
    }
}

const navDOM = new NavDOM()