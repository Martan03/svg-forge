import Action from "./action/action.js";
import {
    actionButtons, svg, svgElement, svgView, themeButtons, posElement
} from "./elements.js";
import { svgState } from "./svg_state.js";
import * as cursor from './action/cursor.js';
import * as line from './action/line.js';

let action = Action.CURSOR;

svgView.addEventListener("wheel", handleScroll);
svgView.addEventListener("mousedown", handleMouseDown);
svgView.addEventListener("mousemove", handleMouseMove);
svgView.addEventListener("mouseup", handleMouseUp);
svgView.addEventListener("mouseleave", handleMouseUp);

window.addEventListener("message", reload);
window.Action = Action;

svgState.updateTransform();
svgState.center();

// Adds transparency grid based on color theme by default
if (document.body.classList.contains('vscode-dark'))
    setBg(document.querySelector('button.dark'));
else if (document.body.classList.contains('vscode-light'))
    setBg(document.querySelector('button.light'));

function setBg (button) {
    themeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    svg.classList.remove('light');
    svg.classList.remove('dark');
    svg.classList.add(button.dataset.theme);
}
window.setBg = setBg;

function setAction (button, act) {
    actionButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    action = act;
}
window.setAction = setAction;

function handleScroll(e) {
    switch (action) {
        case Action.CURSOR:
            cursor.handleScroll(e);
            break;
        case Action.ADD_LINE:
            line.handleScroll(e);
            break;
    }
}

function handleMouseDown(e) {
    switch (action) {
        case Action.CURSOR:
            cursor.handleMouseDown(e);
            break;
        case Action.ADD_LINE:
            line.handleMouseDown(e);
            break;
    }
}

function handleMouseMove(e) {
    const mousePos = getMousePos(e);
    setMousePos(mousePos);

    switch (action) {
        case Action.CURSOR:
            cursor.handleMouseMove(e);
            break;
        case Action.ADD_LINE:
            line.handleMouseMove(e);
            break;
    }
}

function handleMouseUp(e) {
    switch (action) {
        case Action.CURSOR:
            cursor.handleMouseUp(e);
            break;
    }
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

function reload(e) {
    switch (e.data.action) {
        case "update":
            svg.innerHTML = e.data.content;
            svgElement = svg.querySelector('svg');
            break;
    }
}
