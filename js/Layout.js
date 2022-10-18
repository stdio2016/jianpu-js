class Layout {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.dx = 0;
        this.dy = 0;
    }

    getx2() {
        return this.x + this.width;
    }

    gety2() {
        return this.y + this.height;
    }

    getbx() {
        return this.x + this.dx;
    }
    
    getby() {
        return this.y + this.dy;
    }

    getdy2() {
        return this.height - this.dy;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    recalcSize() {
        ;
    }

    render() {
        var g = createSvg('g', {});
        g.appendChild(createSvg('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: 'none',
            stroke: 'black',
            class: 'debug',
        }));
        g.appendChild(createSvg('line', {
            x1: this.x,
            y1: this.getby(),
            x2: this.getx2(),
            y2: this.getby(),
            stroke: 'red',
            class: 'debug',
        }));
        g.appendChild(createSvg('line', {
            x1: this.getbx(),
            y1: this.y,
            x2: this.getbx(),
            y2: this.gety2(),
            stroke: 'red',
            class: 'debug',
        }));
        return g;
    }
}
