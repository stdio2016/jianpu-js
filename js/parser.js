class Parser {
    constructor() {
        this.code = [''];
        this.cur = ''
        this.pos = 0
        this.line = 0
    }

    parse(code) {
        this.code = code.split('\n');
        for (var i = 0; i < this.code.length; i++) {
            this.line = i;
            this.cur = this.code[i];
            this.parseLine();
        }
    }

    parseLine() {
        if (this.cur.startsWith('w:')) {
            this.pos = 2;
            this.parseLyrics();
        } else if (this.cur.startsWith('V')) {
            // TODO: multi voice/part
        } else {
            this.parseJianpu();
        }
    }

    parseJianpu() {
        var n = this.cur.length;
        while (this.pos < n) {
            var item = this.parseNote();
            if (!item) {
                item = this.parseBar();
            }
            if (item) {
                console.log(item);
            } else {
                this.pos++;
            }
        }
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
        var duration = this.parseDuration();
        return [accidental, step, octave, ...duration];
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
        return [numBeams, dots, mul];
    }

    parseBar() {
        var slice = this.cur.slice(this.pos);
        if (slice.startsWith('|')) {
            this.pos++;
            return '|';
        }
        return null;
    }
}
var p = new Parser();
p.parse(`3321_.7,= | 7,_.1=-_.6,=-- | 6,6,_.7,=12_.1= | 7,--- |`);