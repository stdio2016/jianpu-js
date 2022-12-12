class Parser {
    constructor() {
        this.code = [''];
        this.cur = ''
        this.pos = 0
        this.line = 0
        /**
         * @type {Cell[]}
         */
        this.lastMeasures = []
        /**
         * @type {Cell[]}
         */
        this.measures = []
    }

    parse(code) {
        this.code = code.split('\n');
        this.measures = [];
        this.lastMeasures = [];
        for (var i = 0; i < this.code.length; i++) {
            this.line = i;
            this.cur = this.code[i];
            this.parseLine();
        }
        return this.measures;
    }

    parseLine() {
        if (this.cur.startsWith('w:')) {
            this.pos = 2;
            var lyrics = this.parseLyrics();
            this.alignLyrics(lyrics);
        } else if (this.cur.startsWith('V')) {
            // TODO: multi voice/part
        } else {
            var cells = this.parseJianpu();
            this.lastMeasures = cells;
            console.log(cells);
            this.measures.push(...cells);
        }
    }

    parseJianpu() {
        var n = this.cur.length;
        var curCell = new Cell([]);
        var cells = [curCell];
        while (this.pos < n) {
            var item = this.parseNote();
            if (item) {
                curCell.data.push(item);
                continue;
            }
            var bar = this.parseBar();
            if (bar) {
                curCell = new Cell([]);
                cells.push(curCell);
                continue;
            }
            this.pos++;
        }
        // remove empty measure
        cells = cells.filter(cell => cell.data.length > 0);
        return cells;
    }

    parseNote() {
        var pos = this.pos;
        var accidental = this.parseAccidental();
        var step = this.cur[this.pos++];
        // deprecated: dash as tied note
        // TODO: X note for beat without pitch
        if (!/[-0-7X]/.test(step)) {
            this.pos = pos;
            return null;
        }
        var octave = this.parseOctave();
        // tied notes, rests, and beats cannot have octave
        if (step == '-' || step == '0' || step == 'X') {
            accidental = '';
            octave = 0;
        }
        var pitch = new Pitch(step, accidental, octave);
        var duration = this.parseDuration();
        return new Note(pitch, duration, []);
    }

    parseAccidental() {
        switch (this.cur[this.pos]) {
            case '#':
                this.pos++;
                if (this.cur[this.pos] == '#') {
                    this.pos++;
                    return '##';
                }
                return '#';
            case 'n':
                this.pos++;
                return 'n';
            case 'b':
                this.pos++;
                if (this.cur[this.pos] == 'b') {
                    this.pos++;
                    return 'bb';
                }
                return 'b';
        }
        return '';
    }

    parseOctave() {
        var octave = 0;
        if (this.cur[this.pos] == "'") {
            while (this.cur[this.pos] == "'") {
                octave++;
                this.pos++;
            }
        } else if (this.cur[this.pos] == ',') {
            while (this.cur[this.pos] == ",") {
                octave--;
                this.pos++;
            }
        }
        return octave;
    }

    parseDuration() {
        var numBeams = 0;
        var dots = 0;
        var mul = 1;
        if (this.cur[this.pos] == '-') {
            while (this.cur[this.pos] == '-') {
                mul++;
                this.pos++;
            }
        } else {
            var ch = this.cur[this.pos];
            while (ch == '=' || ch == '_') {
                if (ch == '=') {
                    numBeams += 2;
                }
                if (ch == '_') {
                    numBeams += 1;
                }
                this.pos++;
                ch = this.cur[this.pos];
            }
        }
        while (this.cur[this.pos] == '.') {
            dots++;
            this.pos++;
        }
        return new Duration(numBeams, dots, mul);
    }

    parseBar() {
        var slice = this.cur.slice(this.pos);
        if (slice.startsWith('|')) {
            this.pos++;
            return '|';
        }
        return null;
    }

    parseLyrics() {
        var len = this.cur.length;
        var text = '';
        var lyrics = [];
        for (; this.pos < len; this.pos++) {
            var ch = this.cur[this.pos];
            if (/^[\s-]/.test(ch)) {
                var type = 'end';
                if (ch == '-') type = 'hyphen';
                if (type != 'end' || text != '') {
                    lyrics.push(new Lyric({text, type}));
                }
                text = '';
            } else if (ch == '*') {
                if (text != '') {
                    lyrics.push(new Lyric({text, type: 'end'}));
                }
                text = '';
                lyrics.push(new Lyric({text, type: 'end'}));
            } else if (ch == '_') {
                if (text != '') {
                    lyrics.push(new Lyric({text, type: 'end'}));
                }
                text = '';
                lyrics.push(new Lyric({text, type: 'continue'}));
            } else {
                text += ch;
            }
        }
        if (text != '') {
            lyrics.push(new Lyric({text, type: 'end'}));
        }
        console.log(lyrics);
        return lyrics;
    }

    /**
     * 
     * @param {Lyric[]} lyrics 
     */
    alignLyrics(lyrics) {
        var i = 0;
        for (var cell of this.lastMeasures) {
            for (var note of cell.data) {
                if (i < lyrics.length) {
                    note.lyrics.push(lyrics[i]);
                    i++;
                }
            }
        }
    }
}
