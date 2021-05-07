const CAROUSEL_DELAY = 1500;//1.5ms - this is the interval between clicks for navigating the carousel (must be >= to the css transition delay)
var isNavigating = false;

/**
 * @param {String} dir 
 * @param {HTMLElement} carouselWrapper 
 */
function carouselNavivation(dir, carouselWrapper) {
    //This flag is to prevent spamming
    if(isNavigating) return;

    const slides = carouselWrapper.children;
    for (var i = 0; i < slides.length; i++) {
        const slide = slides[i];

        //Find the active slide
        if (slide.className.includes('active')) {            
            //Set this to true to prevent spamming
            isNavigating = true;

            //Set new active slide index
            let idx = dir === 'next' ? i + 1 : i - 1;
            //Set the new index to 0 if its more than the number of slides and set to 
            //the last slide index if it is less than 0
            if (idx < 0)
                idx = slides.length - 1;
            else if (idx >= slides.length)
                idx = 0;

            //Set the new active slide class to 'next'/'prev' to place it in the correct initial position
            const newActiveSlide = slides[idx];
            newActiveSlide.className = newActiveSlide.className + ` ${dir}`;

            //Use setTimeout() with 0ms delat so that the browser can update the 
            //new active slide direction class assigned above before setting it to 'active' in the next loop.
            //This is so that the css animation will be triggered
            setTimeout(() => {
                //Set the new active slide class to 'active'
                newActiveSlide.className = newActiveSlide.className.replace(dir, 'active').trim();

                //Set the current active slide position class to 'next'/'prev' depending on the direction
                const dirClass = dir === 'next' ? 'prev' : 'next';
                slide.className = slide.className.replace('active', dirClass).trim();                

                //Remove the direction class that was added to the previous active slide
                //and set the isNavigating flag to false
                setTimeout(_ => {
                    slide.className = slide.className.replace(dirClass, '').trim();
                    isNavigating = false;
                }, CAROUSEL_DELAY);
            }, 0);

            break;
        }
    }
}

function updateCarousels(carousels) {    
    for (var i = 0; i < carousels.length; i++) {        
        /**@type{HTMLElement} */
        const carousel = carousels[i];

        const dataid = carousel.getAttribute('data-id');        

        /**@type{HTMLButtonElement} */
        const prevBtn = carousel.getElementsByClassName('prev-btn')[0];
        /**@type{HTMLButtonElement} */
        const nextBtn = carousel.getElementsByClassName('next-btn')[0];

        const carouselWrapper = carousel.getElementsByClassName('carousel-wrapper')[0];

        prevBtn.onclick = _ => carouselNavivation('prev', carouselWrapper);
        nextBtn.onclick = _ => carouselNavivation('next', carouselWrapper);
    }    
}