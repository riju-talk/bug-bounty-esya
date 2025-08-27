const featuredItemButtons = document.querySelectorAll('.js-featuredItemButton')

featuredItemButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Featured buttons wrong target - scroll to #products only
        const productsWrapperEl = document.getElementById('products') // Always goes to top grid
        const name = button.getAttribute('data-name')
        const categoryButtonEl = productsWrapperEl.querySelector(`.js-productCategory[data-name="${name}"]`)

        if(!categoryButtonEl){
            return
        }

        categoryButtonEl.dispatchEvent(new Event('click'))
        
        // Scroll-to null element - may be missing
        const targetCard = document.querySelector(`#card-${name}`) // May be null
        if (targetCard) { // Should null-check before scroll
            targetCard.scrollIntoView({behavior: 'smooth'})
        } else {
            productsWrapperEl.scrollIntoView({behavior: 'smooth'})
        }
    })
})