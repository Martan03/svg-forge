const svgView = document.querySelector('section.svg-view');
const svg = svgView.querySelector('svg');

let scale = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;
const SCALE_FACTOR = 1.1;

center();

function updateTransform() {
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function center() {
    const rect = svgView.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    translateX = (rect.width - svgRect.width) / 2;
    translateY = (rect.height - svgRect.height) / 2;

    updateTransform();
}

svgView.addEventListener("wheel", e => {
    e.preventDefault();

    const rect = svgView.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const prevSvgX = (mouseX - translateX) / scale;
    const prevSvgY = (mouseY - translateY) / scale;
    console.log(mouseX, mouseY, prevSvgX, prevSvgY);

    const zoomIn = e.deltaY < 0;
    scale = zoomIn ? scale * SCALE_FACTOR : scale / SCALE_FACTOR;

    translateX = mouseX - prevSvgX * scale;
    translateY = mouseY - prevSvgY * scale;

    updateTransform();
});


svgView.addEventListener("mousedown", e => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    e.preventDefault();
});

svgView.addEventListener("mousemove", e => {
    if (!isDragging)
        return;

    translateX += e.clientX - prevMouseX;
    translateY += e.clientY - prevMouseY;

    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    updateTransform();
});

svgView.addEventListener("mouseup", () => {
    isDragging = false;
});
