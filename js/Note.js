class Note {
    /**
     * Create a note
     * @param {Pitch} pitch
     * @param {Duration} duration
     * @param {Lyric[]} lyrics
     */
    constructor(pitch, duration, lyrics) {
        this.pitch = pitch;
        this.duration = duration;
        if (lyrics) {
            this.lyrics = lyrics;
        } else {
            this.lyrics = [];
        }
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
        this.beamLayout = new BeamLayout(note.duration.numBeams);
        this.dashLayout = [];
        for (var i = 0; i < this.note.duration.mul - 1; i++) {
            this.dashLayout.push(new DashLayout());
        }
        this.lyricsLayout = note.lyrics.map(lyric => {
            var layout = new TextLayout(lyric.text);
            layout.dx = layout.width / 2;
            return layout;
        });
        this.recalcSize();
    }

    recalcSize() {
        this.width = this.pitchLayout.width;
        this.height = this.pitchLayout.height;
        this.dx = this.pitchLayout.dx;
        this.dy = this.pitchLayout.dy;

        // handle duration beams
        this.height += this.beamLayout.height;

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
            dash.dy = this.pitchLayout.stepLayout.getcy();
        });
        
        // handle lyrics
        var left = this.dx, right = this.getdx2();
        this.lyricsLayout.forEach(lyrics => {
            left = Math.max(lyrics.dx, left);
            right = Math.max(lyrics.getdx2(), right);
        });
        this.dx = left;
        this.width = this.dx + right;
    }

    render() {
        var fr = super.render();
        fr.appendChild(this.pitchLayout.render());
        
        // handle duration beams
        if (this.beamLayout.numBeams > 0) {
            for (var i = 0; i < this.beamLayout.numBeams; i++) {
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
            var y = this.getby() + this.beamLayout.height;
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
                cy: pitchLayout.stepLayout.getcy(),
                r: 1.5
            });
            fr.appendChild(elt);
        }
        for (var lyric of this.lyricsLayout) {
            fr.appendChild(lyric.render());
        }
        return fr;
    }

    setPos(x, y) {
        super.setPos(x, y);
        this.pitchLayout.setPos(this.getbx()-this.pitchLayout.dx, y);
        for (var lyric of this.lyricsLayout) {
            lyric.setPos(this.getbx()-lyric.dx, y+this.dy+lyric.height);
        }
    }
}
