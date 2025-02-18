import { svg, svgElement, svgView } from "./elements.js";

class SvgState {
    static instance = null;

    constructor() {
        if (SvgState.instance)
            return SvgState.instance;

        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;

        this.width = svgElement.getAttribute('width') ?? svgView.clientWidth;
        this.height =
            svgElement.getAttribute('height') ?? svgView.clientHeight;
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');

        const viewBox = svgElement.getAttribute('viewBox');
        [this.wbX, this.wbY, this.wbWidth, this.wbHeight] =
            viewBox.split(" ").map(Number);

        SvgState.instance = this;
    }

    center() {
        const rect = svgView.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        this.translateX = (rect.width - svgRect.width) / 2;
        this.translateY = (rect.height - svgRect.height) / 2;

        updateTransform();
    }

    updateTransform() {
        svg.style.transform =
            `translate(${this.translateX}px, ${this.translateY}px)`;
        svg.style.width = `${this.width * this.scale}px`;
        svg.style.height = `${this.height * this.scale}px`
    }
}

export default SvgState;
