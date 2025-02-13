const SCALE_FACTOR = 1.1;

let svgView, svg, svgElement;
let width, height, scale = 1;
let translateX = 0, translateY = 0;
let isDragging = false, prevMouseX = 0, prevMouseY = 0;

document.addEventListener("DOMContentLoaded", () => {
    svgView = document.querySelector('section.svg-view');
    svg = svgView.querySelector('.svg-wrapper');
    svgElement = svg.querySelector('svg');

    if (!svgView || !svg || !svgElement)
        return;

    width = svgElement.getAttribute('width') ?? svgView.clientWidth;
    height = svgElement.getAttribute('height') ?? svgView.clientHeight;
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    updateTransform();
    center();

    // Adds transparency grid based on color theme by default
    if (document.body.classList.contains('vscode-dark'))
        svg.classList.add('dark');
    else if (document.body.classList.contains('vscode-light'))
        svg.classList.add('light')

    svgView.addEventListener("wheel", handleScroll);
    svgView.addEventListener("mousedown", handleMouseDown);
    svgView.addEventListener("mousemove", handleMouseMove);
    svgView.addEventListener("mouseup", () => isDragging = false);
    svgView.addEventListener("mouseleave", () => isDragging = false);

    window.addEventListener("message", reload);
});

function handleScroll(e) {
    e.preventDefault();

    const rect = svgView.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = (mouseX - translateX) / scale;
    const deltaY = (mouseY - translateY) / scale;

    scale *= Math.pow(SCALE_FACTOR, -e.deltaY / 100);

    translateX = mouseX - deltaX * scale;
    translateY = mouseY - deltaY * scale;

    updateTransform();
}

function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
}

function handleMouseMove(e) {
    if (!isDragging)
        return;

    translateX += e.clientX - prevMouseX;
    translateY += e.clientY - prevMouseY;

    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    updateTransform();
}

function updateTransform() {
    svg.style.transform = `translate(${translateX}px, ${translateY}px)`;
    svg.style.width = `${width * scale}px`;
    svg.style.height = `${height * scale}px`
}

function center() {
    const rect = svgView.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    translateX = (rect.width - svgRect.width) / 2;
    translateY = (rect.height - svgRect.height) / 2;

    updateTransform();
}

function setBg(theme) {
    svg.classList.remove('light');
    svg.classList.remove('dark');
    svg.classList.add(theme);
}

function reload(e) {
    switch (e.data.action) {
        case "update":
            svg.innerHTML = e.data.content;
            svgElement = svg.querySelector('svg');
            break;
    }
}
