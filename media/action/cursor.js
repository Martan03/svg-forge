import { scaleDisplay, svgView } from "../elements.js";
import { svgState } from "../svg_state.js";
import { ActionType } from "./action.js";

const SCALE_FACTOR = 1.1;

class CursorAction extends ActionType {
    constructor() {
        super();
        this.isDragging = false;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
    }

    handleScroll(e) {
        e.preventDefault();
        const rect = svgView.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const deltaX = (mouseX - svgState.translateX) / svgState.scale;
        const deltaY = (mouseY - svgState.translateY) / svgState.scale;

        svgState.scale *= Math.pow(SCALE_FACTOR, -e.deltaY / 100);
        scaleDisplay.innerHTML = `${(svgState.scale * 100).toFixed(2)}%`;

        svgState.translateX = mouseX - deltaX * svgState.scale;
        svgState.translateY = mouseY - deltaY * svgState.scale;

        svgState.updateTransform();
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
    }

    handleMouseMove(e) {
        e.preventDefault();
        if (!this.isDragging)
            return;

        svgState.translateX += e.clientX - this.prevMouseX;
        svgState.translateY += e.clientY - this.prevMouseY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;

        svgState.updateTransform();
    }

    handleMouseUp(e) {
        e.preventDefault();
        this.isDragging = false;
    }
}

export default CursorAction;
