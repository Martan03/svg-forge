import Action from "./action/action.js";
import {
    actionButtons, svg, svgElement, svgView, themeButtons, posElement,
    refreshSvg,
    scaleOptions,
    scaleOption,
    scaleDisplay
} from "./elements.js";
import { svgState } from "./svg_state.js";

import CursorAction from './action/cursor.js';
import LineAction from './action/line.js';
import CircleAction from './action/circle.js';
import RectAction from './action/rect.js';

let action = new CursorAction();

// Action handlers without any additional code
svgView.addEventListener("wheel", e => action.handleScroll(e));
svgView.addEventListener("mousedown", e => action.handleMouseDown(e));
svgView.addEventListener("mouseup", e => action.handleMouseUp(e));
// Action handlers with additional code
svgView.addEventListener("mousemove", handleMouseMove);
svgView.addEventListener("mouseleave", handleMouseLeave);

scaleOptions.forEach(o => o.addEventListener("click", e => {
    const num = parseFloat(e.target.value);
    svgState.scale = isNaN(num) ? coverScale() : num;

    scaleDisplay.innerHTML = `${(svgState.scale * 100).toFixed(2)}%`;
    svgState.updateTransform();
    scaleOption.classList.remove('visible');
}));

window.addEventListener("message", reload);
window.Action = Action;

svgState.updateTransform();
svgState.center();

// Adds transparency grid based on color theme by default
if (document.body.classList.contains('vscode-dark'))
    setBg(document.querySelector('button.dark'));
else if (document.body.classList.contains('vscode-light'))
    setBg(document.querySelector('button.light'));

function setBg(button) {
    themeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    svg.classList.remove('light');
    svg.classList.remove('dark');
    svg.classList.add(button.dataset.theme);
}
window.setBg = setBg;

function setAction(button, act) {
    actionButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    switch (act) {
        case Action.CURSOR:
            action = new CursorAction();
            break;
        case Action.ADD_LINE:
            action = new LineAction();
            break;
        case Action.ADD_CIRCLE:
            action = new CircleAction();
            break;
        case Action.ADD_RECT:
            action = new RectAction();
            break;
    }
}
window.setAction = setAction;

window.scaleOption = scaleOption;
window.svgState = svgState;

function handleMouseMove(e) {
    const mousePos = getMousePos(e);
    setMousePos(mousePos);

    action.handleMouseMove(e);
}

function handleMouseLeave(e) {
    setMousePos(null);
    action.handleMouseUp(e);
}

export function getMousePos(e) {
    const rect = svgElement.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (svgState.scale * svgState.width)
            * svgState.wbWidth,
        y: (e.clientY - rect.top) / (svgState.scale * svgState.height)
            * svgState.wbHeight,
    };
}

export function setMousePos(pos) {
    if (!posElement)
        return;
    posElement.innerHTML =
        `${pos?.x.toFixed(3) ?? '-'}, ${pos?.y.toFixed(3) ?? '-'}`;
}

function coverScale() {
    const rect = svgView.getBoundingClientRect();

    let scaleX = rect.width / svgState.width;
    let scaleY = rect.height / svgState.height;
    return Math.min(scaleX, scaleY);
}

function reload(e) {
    switch (e.data.action) {
        case "update":
            svg.innerHTML = e.data.content;
            refreshSvg();
            svgState.refreshSvg();
            break;
    }
}
