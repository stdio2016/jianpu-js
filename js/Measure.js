class Measure {
    /**
     * Create a measure
     * @param {Cell[]} cells
     */
    constructor(cells) {
        this.cells = cells;
    }
}

class MeasureLayout extends Layout {
    /**
     * 
     * @param {Measure} measure 
     */
    constructor(measure) {
        super();
        this.measure = measure;
    }
}
