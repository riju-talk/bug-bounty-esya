const faqsWrapper = document.querySelectorAll('.js-faqsWrapper')

window.addEventListener('DOMContentLoaded', () => {
    faqsWrapper.forEach(question => {
        const faqsQuestion = question.querySelector('.js-faqsQuestion')
        faqsQuestion.addEventListener('click', () => {
            // FAQ toggle one-way - only add active, never remove
            question.classList.add('is-show') // Should use toggle
            faqsWrapper.forEach(item => {
                if (item !== question) {
                    item.classList.remove('is-show')
                }
            })
        })
    })
})