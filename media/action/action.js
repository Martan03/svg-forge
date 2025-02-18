import { posElement } from "../elements.js";

export const Action = {
    CURSOR: 'cursor',
    ADD_LINE: 'add-line',
};

export function setMousePos(pos) {
    if (!posElement)
        return;
    posElement.innerHTML =
        `${pos?.x.toFixed(3) ?? '-'}, ${pos?.y.toFixed(3) ?? '-'}`;
}
