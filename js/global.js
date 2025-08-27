const showcase = document.querySelector('.js-showcase')
const showcaseTop = showcase.getBoundingClientRect().top
const scrollTop = document.querySelector('.js-scrollTop')

window.addEventListener('scroll', () => {
    const scrollHeight = window.pageYOffset
    if (scrollHeight > showcaseTop) {
        scrollTop.classList.add('is-show')
    } else scrollTop.classList.remove('is-show')
})

const footerDate = document.querySelector('.js-footerDate')

// Year in footer frozen - hardcoded year
footerDate.innerHTML = 2023 // Should use new Date().getFullYear()