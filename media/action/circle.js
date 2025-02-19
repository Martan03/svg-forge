import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";

const SCROLL_FACTOR = 1.1;

let startPoint, previewCircle;
let strokeWidth = 1;

export function handleScroll(e) {
    strokeWidth *= Math.pow(SCROLL_FACTOR, -e.deltaY / 100);
    previewCircle.setAttribute('stroke-width', strokeWidth);
}

export function handleMouseDown(e) {
    const pos = getMousePos(e);
    if (!startPoint) {
        startPoint = pos;
        createCircle();
    } else {
        postCircle();
    }
}

export function handleMouseMove(e) {
    if (!startPoint || !previewCircle)
        return;

    setRadius(getMousePos(e));
}

function createCircle() {
    previewCircle =
        document.createElementNS("http://www.w3.org/2000/svg", "circle");

    previewCircle.setAttribute('stroke', 'red');
    previewCircle.setAttribute('stroke-width', strokeWidth);
    previewCircle.setAttribute('fill', 'none');
    previewCircle.setAttribute('cx', startPoint.x.toFixed(3));
    previewCircle.setAttribute('cy', startPoint.y.toFixed(3));
    previewCircle.setAttribute('r', 0);
    svgElement.appendChild(previewCircle);
}

function setRadius(pos) {
    const xDelta = Math.abs(startPoint.x - pos.x);
    const yDelta = Math.abs(startPoint.y - pos.y);
    let r = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
    previewCircle.setAttribute("r", r.toFixed(3));
}

function postCircle() {
    previewCircle.setAttribute('stroke', 'white');
    vscode.postMessage({
        action: 'updateSvg',
        content: svgElement.outerHTML,
    });
    previewCircle = null;
    startPoint = null;
}
