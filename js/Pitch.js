const ACCIDENTAL_MAP = {
    '#': 1, '##': 2,
    'n': 0,
    'b': -1, 'bb': -2,
    '': 0,
};

const ACCIDENTAL_OUT_MAP = {
    '#': '♯', '##': 'x',
    'n': '♮',
    'b': '♭', 'bb': '♭♭',
};

class Pitch {
    /**
     * Create a pitch for a Note
     * @param {number} step
     *  an integer between 1 and 7 representing note name, or 0 
     *  representing rest note
     * @param {string} accidental
     *  accidental string, can be any of: '##' '#' 'n' 'b' 'bb' ''
     * @param {number} octave
     *  octave number, middle 1 is octave 0
     */
    constructor(step, accidental, octave) {
        this.step = step;
        this.accidental = accidental;
        this.octave = octave;
    }

    /**
     * Get the accidental up and down steps
     */
    getAlter() {
        return +ACCIDENTAL_MAP[this.accidental];
    }
}

class PitchLayout extends Layout {
    /**
     * 
     * @param {Pitch} pitch 
     */
    constructor(pitch) {
        super();
        this.pitch = pitch;
        this.stepLayout = new StepLayout(pitch.step);
        this.accWidth = 0;
        this.octaveY = 0;
        this.recalcSize();
    }

    recalcSize() {
        this.width = 8;
        this.height = 16;
        this.dx = this.width / 2;
        this.dy = this.height;

        this.accWidth = 0;
        if (this.pitch.accidental) {
            this.accWidth = 6.5;
            if (this.pitch.accidental === 'bb') {
                this.accWidth = 9;
            }
            this.width += this.accWidth - 1;
            this.dx += this.accWidth - 1;
        }

        // handle higher octave
        if (this.pitch.octave > 0) {
            this.octaveY = 0 - 2 - this.pitch.octave * 4;
            if (this.octaveY < 0) {
                this.dy -= this.octaveY;
                this.height -= this.octaveY;
                this.octaveY = 0;
            }
        }
    }

    setPos(x, y) {
        var y0 = y;
        if (this.pitch.octave > 0) {
            y0 += this.pitch.octave * 4 + 2;
        }
        super.setPos(x, y);
        this.stepLayout.setPos(x + this.accWidth, y0);
    }

    render() {
        var base = super.render();

        if (this.pitch.accidental) {
            var accEl = createSvg('text', {
                x: this.x + this.accWidth / 2,
                textLength: this.accWidth,
                y: this.getby() - 10
            });
            accEl.style.textAnchor = 'middle';
            accEl.style.fontSize = '12px';
            accEl.textContent = ACCIDENTAL_OUT_MAP[this.pitch.accidental];
            base.appendChild(accEl);
        }

        // render higher octave
        if (this.pitch.octave > 0) {
            var y = this.stepLayout.y - 2;
            for (var i = 0; i < this.pitch.octave; i++) {
                var elt = createSvg('circle', {
                    cx: this.getbx(),
                    cy: y - i * 4,
                    r: 1.5
                });
                base.appendChild(elt);
            }
        }

        base.appendChild(this.stepLayout.render());
        return base;
    }
}

class StepLayout extends Layout {
    /**
     * 
     * @param {number} step 
     */
    constructor(step) {
        super();
        this.step = step;
        this.width = 8;
        this.height = 16;
    }

    render() {
        var stepEl = createSvg('text', {
            x: this.getcx(),
            y: this.getcy()});
        stepEl.style.textAnchor = 'middle';
        stepEl.style.dominantBaseline = 'central';
        stepEl.textContent = this.step;
        return stepEl;
    }
}
