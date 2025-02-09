const svgView = document.querySelector('.svg-view');
const svg = document.querySelector('.svg-view svg');

let isDragging = false;
let initialMouseX = 0;
let initialMouseY = 0;
let initialSVGTransformX = 0;
let initialSVGTransformY = 0;

svgView.addEventListener('mousedown', e => {
    isDragging = true;





    
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;

    const transform = getComputedStyle(svg).transform;
    if (transform === 'none') {
        initialSVGTransformX = 0;
        initialSVGTransformY = 0;
    } else {
        const matrix = new DOMMatrix(transform);
        initialSVGTransformX = matrix.m41;
        initialSVGTransformY = matrix.m42;
    }

    e.preventDefault();
});

svgView.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    // Calculate the distance the mouse has moved since the mousedown event
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;

    // Update the transform property to move the SVG relative to the mouse movement
    svg.style.transform = `translate(-50%, -50%) translate(${initialSVGTransformX + deltaX}px, ${initialSVGTransformY + deltaY}px)`;
});

svgView.addEventListener('mouseup', () => {
    // Stop dragging when mouse is released
    isDragging = false;
});

svgView.addEventListener('mouseleave', () => {
    // Also stop dragging if the mouse leaves the svg-view
    isDragging = false;
});

