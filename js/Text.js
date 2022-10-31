class TextLayout extends Layout {
    constructor(text) {
        super();
        var {width, height} = getTextSize(text, 12+'px');
        this.text = text;
        this.width = width + 3;
        this.height = height;
    }

    render() {
        var elt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        elt.setAttribute('x', this.x + 2);
        elt.setAttribute('y', this.y);
        elt.style.fontSize = '12px';
        elt.textContent = this.text;
        return elt;
    }
}
