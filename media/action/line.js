import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";
import { CreateActionType } from "./action.js";

class LineAction extends CreateActionType {
    handleMouseMove(e) {
        if (!this.startPoint || !this.preview)
            return;

        const pos = getMousePos(e);
        this.preview.setAttribute("x2", pos.x.toFixed(3));
        this.preview.setAttribute("y2", pos.y.toFixed(3));
    }

    create() {
        this.preview =
            document.createElementNS("http://www.w3.org/2000/svg", "line");

        this.preview.setAttribute('stroke', 'red');
        this.preview.setAttribute('stroke-width', this.strokeWidth);
        this.preview.setAttribute('x1', this.startPoint.x.toFixed(3));
        this.preview.setAttribute('y1', this.startPoint.y.toFixed(3));
        this.preview.setAttribute('x2', this.startPoint.x.toFixed(3));
        this.preview.setAttribute('y2', this.startPoint.y.toFixed(3));
        svgElement.appendChild(this.preview);
    }
}

export default LineAction;
