export const svgView = document.querySelector('section.svg-view');
export const svg = svgView.querySelector('.svg-wrapper');
export let svgElement = svg.querySelector('svg');

export const scaleOption = document.querySelector('.options');
export const scaleOptions = document.querySelectorAll('.options option');
export const scaleDisplay = document.getElementById('scale-display');

export const themeButtons = document.querySelectorAll('button.theme');
export const actionButtons = document.querySelectorAll('button.action');
export const posElement = document.getElementById('mouse-pos');

export function refreshSvg() {
    svgElement = svg.querySelector('svg');
}
