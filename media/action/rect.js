import { svgElement } from "../elements.js";
import { getMousePos } from "../script.js";
import { CreateActionType } from "./action.js";

class RectAction extends CreateActionType {
    handleMouseMove(e) {
        if (!this.startPoint || !this.preview)
            return;

        const pos = getMousePos(e);
        const width = pos.x - this.startPoint.x;
        const height = pos.y - this.startPoint.y;
        this.preview.setAttribute('width', Math.abs(width).toFixed(3));
        this.preview.setAttribute('height', Math.abs(height).toFixed(3));

        const setPos = (c, p) => this.preview.setAttribute(c, p.toFixed(3));
        if (width < 0)
            setPos('x', this.startPoint.x + width);
        if (height < 0)
            setPos('y', this.startPoint.y + height);
    }

    create() {
        this.preview =
            document.createElementNS("http://www.w3.org/2000/svg", "rect");

        this.preview.setAttribute('stroke', 'red');
        this.preview.setAttribute('stroke-width', this.strokeWidth);
        this.preview.setAttribute('fill', 'none');
        this.preview.setAttribute('x', this.startPoint.x.toFixed(3));
        this.preview.setAttribute('y', this.startPoint.y.toFixed(3));
        this.preview.setAttribute('width', 0);
        this.preview.setAttribute('height', 0);
        svgElement.appendChild(this.preview);
    }
}

export default RectAction;
