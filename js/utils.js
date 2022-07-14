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
