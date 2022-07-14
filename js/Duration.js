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
