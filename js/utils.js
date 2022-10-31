/**
 * Create a SVG element
 * @param {string} name
 * @param {{[x: string]: string}} attr
 * @returns {SVGElement}
 */
function createSvg(name, attr) {
    var elt = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (var aname in attr) {
        elt.setAttribute(aname, attr[aname]);
    }
    return elt;
}

var baseSvg = createSvg('svg', {width: 0, height: 0});
document.body.appendChild(baseSvg);
function getTextSize(text, fontSize) {
    var elt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    baseSvg.appendChild(elt);
    elt.textContent = text;
    elt.style.fontSize = fontSize;
    var {width, height} = elt.getBBox();
    elt.remove();
    return {width, height};
}
