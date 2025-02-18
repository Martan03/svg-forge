import { svgView } from "../elements.js";

const SCALE_FACTOR = 1.1;

let isDragging = false;
let width, height, scale = 1;

export function handleScroll(e) {
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

export function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
}

export function handleMouseMove(e) {
    mousePos = getMousePos(e);
    setMousePos(mousePos);

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
