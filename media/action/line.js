import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";

const SCROLL_FACTOR = 1.1;

let startPoint, previewLine;
let strokeWidth = 1;

export function handleScroll(e) {
    strokeWidth *= Math.pow(SCROLL_FACTOR, -e.deltaY / 100);
    previewLine.setAttribute('stroke-width', strokeWidth);
}

export function handleMouseDown(e) {
    const pos = getMousePos(e);
    if (!startPoint) {
        startPoint = pos;
        createLine();
    } else {
        postLine();
    }
}

export function handleMouseMove(e) {
    if (!startPoint || !previewLine)
        return;

    setEndPos(getMousePos(e));
}

function createLine() {
    previewLine =
        document.createElementNS("http://www.w3.org/2000/svg", "line");

    previewLine.setAttribute('stroke', 'red');
    previewLine.setAttribute('stroke-width', strokeWidth);
    previewLine.setAttribute('x1', startPoint.x.toFixed(3));
    previewLine.setAttribute('y1', startPoint.y.toFixed(3));
    previewLine.setAttribute('x2', startPoint.x.toFixed(3));
    previewLine.setAttribute('y2', startPoint.y.toFixed(3));
    svgElement.appendChild(previewLine);
}

function setEndPos(pos) {
    previewLine.setAttribute("x2", pos.x.toFixed(3));
    previewLine.setAttribute("y2", pos.y.toFixed(3));
}

function postLine() {
    previewLine.setAttribute('stroke', 'white');
    vscode.postMessage({
        action: 'updateSvg',
        content: svgElement.outerHTML,
    });
    previewLine = null;
    startPoint = null;
}
