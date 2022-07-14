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
        this.stepY = 0;
        this.stepCy = 0;
        this.accWidth = 0;
        this.octaveY = 0;
        this.recalcSize();
    }

    recalcSize() {
        this.width = 8;
        this.height = 16;
        this.dx = this.width / 2;
        this.dy = this.height;
        this.stepY = 0;
        this.stepCy = this.height * 0.5;

        this.accWidth = 0;
        if (this.pitch.accidental) {
            this.accWidth = 6.5;
            if (this.pitch.accidental === 'bb') {
                this.accWidth = 9;
            }
            this.width += this.accWidth - 1;
            this.dx += this.accWidth - 1;
            this.stepY += 4;
            this.dy += 4;
            this.height += 4;
        }

        // handle higher octave
        if (this.pitch.octave > 0) {
            this.octaveY = this.stepY - 2 - this.pitch.octave * 4;
            if (this.octaveY < 0) {
                this.stepY -= this.octaveY;
                this.dy -= this.octaveY;
                this.height -= this.octaveY;
                this.octaveY = 0;
            }
        }
    }

    getStepCy() {
        return this.y + this.stepY + this.stepCy;
    }

    render() {
        var base = super.render();

        if (this.pitch.accidental) {
            var accEl = createSvg('text', {
                x: this.x + this.accWidth / 2,
                textLength: this.accWidth,
                y: this.getcy() - 10
            });
            accEl.style.textAnchor = 'middle';
            accEl.style.fontSize = '12px';
            accEl.textContent = ACCIDENTAL_OUT_MAP[this.pitch.accidental];
            base.appendChild(accEl);
        }

        // render higher octave
        if (this.pitch.octave > 0) {
            var y = this.y + this.stepY - 2;
            for (var i = 0; i < this.pitch.octave; i++) {
                var elt = createSvg('circle', {
                    cx: this.getcx(),
                    cy: y - i * 4,
                    r: 1.5
                });
                base.appendChild(elt);
            }
        }

        var stepEl = createSvg('text', {
            x: this.getcx(),
            y: this.getcy() - 3.5});
        stepEl.style.textAnchor = 'middle';
        stepEl.textContent = this.pitch.step;
        base.appendChild(stepEl);
        return base;
    }
}
