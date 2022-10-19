class Duration {
    /**
     * Create a duration for a Note
     * @param {number} numBeams
     *  for eighth (1 beam), 16th (2 beams), 32th (3 beams) note
     * @param {number} dots
     *  for dotted notes, can have at most 2 dots
     * @param {number} mul
     *  for whole note (4 beats) and half note (2 beats)
     */
    constructor(numBeams, dots, mul=1) {
        this.numBeams = numBeams;
        this.dots = dots;
        this.mul = mul;
    }

    getBeat() {
        return Math.pow(0.5, this.numBeams)
            * this.mul
            * (2 - Math.pow(0.5, this.dots));
    }
}

class BeamLayout extends Layout {
    constructor(numBeams) {
        super();
        this.numBeams = numBeams;
        this.recalcSize();
    }

    recalcSize() {
        // handle duration beams
        this.height = 0;
        if (this.numBeams > 0) {
            var sp = this.numBeams * 3;
            this.height += sp;
        }
    }
}

class DashLayout extends Layout {
    constructor() {
        super();
        this.width = 8;
        this.dx = this.width / 2;
    }

    render() {
        return createSvg('line', {
            x1: this.x + 1,
            y1: this.y,
            x2: this.getx2() - 1,
            y2: this.gety2(),
            stroke: 'black'
        });
    }
}
