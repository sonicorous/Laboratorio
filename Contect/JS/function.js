const observerOptions = { root: null, rootMargin: "0px", threshold: 0.7 };

function observerCallback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.replace('fadeOut', 'fadeIn');
        } else {
        entry.target.classList.replace('fadeIn', 'fadeOut');
        }
    });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

const fadeElms = document.querySelectorAll('.carousel-item');
fadeElms.forEach(el => observer.observe(el));


const slider = document.querySelector('#idcarousel-pointer');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', e => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', _ => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', _ => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const SCROLL_SPEED = 2;
    const walk = (x - startX) * SCROLL_SPEED;
    slider.scrollLeft = scrollLeft - walk;
});