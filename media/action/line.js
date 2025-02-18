import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";

let startPoint, previewLine;
let strokeWidth = 1;

export function handleScroll(e) {
    strokeWidth++;
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
    previewLine.setAttribute('stroke-width', strokeWidth);
    previewLine.setAttribute('x1', startPoint.x);
    previewLine.setAttribute('y1', startPoint.y);
    previewLine.setAttribute('x2', startPoint.x);
    previewLine.setAttribute('y2', startPoint.y);
    svgElement.appendChild(previewLine);
}

function setEndPos(pos) {
    previewLine.setAttribute("x2", pos.x);
    previewLine.setAttribute("y2", pos.y);
}

function postLine() {
    vscode.postMessage({
        action: 'updateSvg',
        content: svgElement.outerHTML,
    });
    previewLine = null;
    startPoint = null;
}
