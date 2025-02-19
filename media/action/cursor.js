import { scaleDisplay, svgView } from "../elements.js";
import { svgState } from "../svg_state.js";

const SCALE_FACTOR = 1.1;

let isDragging = false;
let prevMouseX = 0, prevMouseY = 0;

export function handleScroll(e) {
    e.preventDefault();

    const rect = svgView.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = (mouseX - svgState.translateX) / svgState.scale;
    const deltaY = (mouseY - svgState.translateY) / svgState.scale;

    svgState.scale *= Math.pow(SCALE_FACTOR, -e.deltaY / 100);
    scaleDisplay.innerHTML = `${(svgState.scale * 100).toFixed(2)}%`;

    svgState.translateX = mouseX - deltaX * svgState.scale;
    svgState.translateY = mouseY - deltaY * svgState.scale;

    svgState.updateTransform();
}

export function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
}

export function handleMouseMove(e) {
    if (!isDragging)
        return;

    svgState.translateX += e.clientX - prevMouseX;
    svgState.translateY += e.clientY - prevMouseY;

    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    svgState.updateTransform();
}

export function handleMouseUp() {
    isDragging = false;
}
