import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";
import { CreateActionType } from "./action.js";

class CircleAction extends CreateActionType {
    handleMouseMove(e) {
        if (!this.startPoint || !this.preview)
            return;

        const pos = getMousePos(e);
        const xDelta = Math.abs(this.startPoint.x - pos.x);
        const yDelta = Math.abs(this.startPoint.y - pos.y);
        let r = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
        this.preview.setAttribute("r", r.toFixed(3));
    }

    create() {
        this.preview =
            document.createElementNS("http://www.w3.org/2000/svg", "circle");

        this.preview.setAttribute('stroke', 'red');
        this.preview.setAttribute('stroke-width', this.strokeWidth);
        this.preview.setAttribute('fill', 'none');
        this.preview.setAttribute('cx', this.startPoint.x.toFixed(3));
        this.preview.setAttribute('cy', this.startPoint.y.toFixed(3));
        this.preview.setAttribute('r', 0);
        svgElement.appendChild(this.preview);
    }
}

export default CircleAction;
