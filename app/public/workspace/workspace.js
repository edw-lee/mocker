document.addEventListener('update', () => {
    const container = document.getElementById('container');

    //Add onclick listener to carousel buttons
    const carousels = container.getElementsByClassName('carousel');
    updateCarousels(carousels);        
});