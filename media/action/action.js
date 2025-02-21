import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";

const SCROLL_FACTOR = 1.1;

const Action = {
    CURSOR: 'cursor',
    ADD_LINE: 'add-line',
    ADD_CIRCLE: 'add-circle',
    ADD_RECT: 'add-rect',
};

export class ActionType {
    handleScroll(_e) { }

    handleMouseDown(_e) { }

    handleMouseMove(_e) { }

    handleMouseUp(_e) {}
}

export class CreateActionType extends ActionType {
    constructor() {
        super();
        this.startPoint = null;
        this.preview = null;
        this.strokeWidth = 1;
    }

    handleScroll(e) {
        this.strokeWidth *= Math.pow(SCROLL_FACTOR, -e.deltaY / 100);
        this.preview.setAttribute('stroke-width', this.strokeWidth.toFixed(3));
    }

    handleMouseDown(e) {
        const pos = getMousePos(e);
        if (!this.startPoint) {
            this.startPoint = pos;
            this.create();
        } else {
            this.post();
        }
    }

    post() {
        this.preview.setAttribute('stroke', 'white');
        vscode.postMessage({
            action: 'updateSvg',
            content: svgElement.outerHTML,
        });
        this.preview = null;
        this.startPoint = null;
    }

    create() { }
}

export default Action;
