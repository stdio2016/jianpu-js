class Note {
    /**
     * Create a note
     * @param {Pitch} pitch
     * @param {Duration} duration
     */
    constructor(pitch, duration) {
        this.pitch = pitch;
        this.duration = duration;
    }
}

class NoteLayout extends Layout {
    /**
     * 
     * @param {Note} note
     */
    constructor(note) {
        super();
        this.note = note;
        this.pitchLayout = new PitchLayout(note.pitch);
        this.duration = this.note.duration;
        this.beamHeight = 0;
        this.dashLayout = [];
        for (var i = 0; i < this.note.duration.mul - 1; i++) {
            this.dashLayout.push(new DashLayout());
        }
        this.recalcSize();
    }

    recalcSize() {
        this.width = this.pitchLayout.width;
        this.height = this.pitchLayout.height;
        this.dx = this.pitchLayout.dx;
        this.dy = this.pitchLayout.dy;

        // handle duration beams
        this.beamHeight = 0;
        if (this.duration.numBeams > 0) {
            var sp = this.duration.numBeams * 3;
            this.beamHeight += sp;
            this.height += sp;
        }

        // handle lower octave dots
        if (this.note.pitch.octave < 0) {
            this.height += -this.note.pitch.octave * 4;
        }

        // handle duration dots
        if (this.duration.dots) {
            this.width += 4 * this.duration.dots + 2;
        }

        // handle duration dashes
        this.dashLayout.forEach(dash => {
            dash.dy = this.pitchLayout.stepCy;
        });
    }

    render() {
        var fr = super.render();
        fr.appendChild(this.pitchLayout.render());
        
        // handle duration beams
        if (this.duration.numBeams > 0) {
            for (var i = 0; i < this.duration.numBeams; i++) {
                var y = this.getby() + 3 * i;
                var elt = createSvg('line', {
                    x1: this.x,
                    y1: y,
                    x2: this.getx2(),
                    y2: y,
                    stroke: 'black',
                });
                fr.appendChild(elt);
            }
        }

        // render lower octave dots
        if (this.note.pitch.octave < 0) {
            var oct = -this.note.pitch.octave;
            var y = this.getby() + this.beamHeight;
            for (var i = 0; i < oct; i++) {
                var elt = createSvg('circle', {
                    cx: this.getbx(),
                    cy: y + i * 4,
                    r: 1.5
                });
                fr.appendChild(elt);
            }
        }
        
        // render duration dots
        var dots = this.duration.dots;
        var pitchLayout = this.pitchLayout;
        for (var d = 0; d < dots; d++) {
            var elt = createSvg('circle', {
                cx: pitchLayout.getx2() + 4 * d + 3,
                cy: pitchLayout.getStepCy(),
                r: 1.5
            });
            fr.appendChild(elt);
        }
        return fr;
    }

    setPos(x, y) {
        super.setPos(x, y);
        this.pitchLayout.setPos(x, y);
    }
}
