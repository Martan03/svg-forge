const SCALE_FACTOR = 1.1;

let mousePos;

let svgView, svg, svgElement, posElement, lineButton, themeButtons;
let width, height, scale = 1;
let wbX, wbY, wbWidth, wbHeight;
let translateX = 0, translateY = 0;
let isDragging = false, prevMouseX = 0, prevMouseY = 0;

let startPoint, previewLine;

document.addEventListener("DOMContentLoaded", () => {
    svgView = document.querySelector('section.svg-view');
    svg = svgView.querySelector('.svg-wrapper');
    svgElement = svg.querySelector('svg');

    themeButtons = document.querySelectorAll('button.theme');
    posElement = document.getElementById('mouse-pos');
    lineButton = document.getElementById('add-line');

    if (!svgView || !svg || !svgElement)
        return;

    width = svgElement.getAttribute('width') ?? svgView.clientWidth;
    height = svgElement.getAttribute('height') ?? svgView.clientHeight;
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    const viewBox = svgElement.getAttribute("viewBox");
    [wbX, wbY, wbWidth, wbHeight] = viewBox.split(" ").map(Number);

    updateTransform();
    center();

    // Adds transparency grid based on color theme by default
    if (document.body.classList.contains('vscode-dark'))
        setBg(document.querySelector('button.dark'));
    else if (document.body.classList.contains('vscode-light'))
        setBg(document.querySelector('button.light'));

    svgView.addEventListener("wheel", handleScroll);
    svgView.addEventListener("mousedown", handleMouseDown);
    svgView.addEventListener("mousemove", handleMouseMove);
    svgView.addEventListener("mouseup", () => isDragging = false);
    svgView.addEventListener("mouseleave", () => isDragging = false);

    window.addEventListener("message", reload);

    svgElement.addEventListener("click", handleSvgClick);
    svgElement.addEventListener("mousemove", handleMouseMoveForLine);

    function handleSvgClick(e) {
        const { x, y } = getMousePos(e);

        if (!startPoint) {
            // First click: Set start point and create preview line
            startPoint = { x, y };
            previewLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            previewLine.setAttribute("stroke", "red");
            previewLine.setAttribute("stroke-width", "2");
            previewLine.setAttribute("x1", x);
            previewLine.setAttribute("y1", y);
            previewLine.setAttribute("x2", x);
            previewLine.setAttribute("y2", y);
            svgElement.appendChild(previewLine);
        } else {
            // Second click: Finalize line and send updated SVG to VS Code
            previewLine.setAttribute("x2", x);
            previewLine.setAttribute("y2", y);
            previewLine.setAttribute("stroke", "black"); // Final color

            // Send updated SVG to the extension
            const updatedSvg = svgElement.outerHTML;
            console.log(updatedSvg);
            vscode.postMessage({ action: "updateSvg", content: updatedSvg });

            // Reset
            previewLine = null;
            startPoint = null;
        }
    }

    function handleMouseMoveForLine(e) {
        if (!startPoint || !previewLine) return;

        const { x, y } = getMousePos(e);
        previewLine.setAttribute("x2", x);
        previewLine.setAttribute("y2", y);
    }
});

function handleScroll(e) {
    e.preventDefault();

    const rect = svgView.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = (mouseX - translateX) / scale;
    const deltaY = (mouseY - translateY) / scale;

    scale *= Math.pow(SCALE_FACTOR, -e.deltaY / 100);

    translateX = mouseX - deltaX * scale;
    translateY = mouseY - deltaY * scale;

    updateTransform();
}

function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
}

function handleMouseMove(e) {
    mousePos = getMousePos(e);
    setMousePos(mousePos);

    if (!isDragging)
        return;

    translateX += e.clientX - prevMouseX;
    translateY += e.clientY - prevMouseY;

    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    updateTransform();
}

function updateTransform() {
    svg.style.transform = `translate(${translateX}px, ${translateY}px)`;
    svg.style.width = `${width * scale}px`;
    svg.style.height = `${height * scale}px`
}

function center() {
    const rect = svgView.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    translateX = (rect.width - svgRect.width) / 2;
    translateY = (rect.height - svgRect.height) / 2;

    updateTransform();
}

function getMousePos(e) {
    const rect = svgElement.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (scale * width) * wbWidth,
        y: (e.clientY - rect.top) / (scale * height) * wbHeight,
    };
}

function setMousePos(pos) {
    if (posElement)
        posElement.innerHTML =
            `${pos?.x.toFixed(3) ?? '-'}, ${pos?.y.toFixed(3) ?? '-'}`;
}

function setBg(button) {
    themeButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');

    svg.classList.remove('light');
    svg.classList.remove('dark');
    svg.classList.add(button.dataset.theme);
}

function reload(e) {
    switch (e.data.action) {
        case "update":
            svg.innerHTML = e.data.content;
            svgElement = svg.querySelector('svg');
            break;
    }
}
