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
        this.cellLayouts = measure.cells.map(cell => new CellLayout(cell));
        this.calcWidth();
    }

    calcWidth() {
        this.width = this.cellLayouts.reduce((a, b) => Math.max(a, b.width), 0);
    }

    calcHeight() {
        ;
    }

    render() {
        var g = super.render();
        var x = this.x;
        var y = this.y;
        for (var cellLayout of this.cellLayouts) {
            cellLayout.setPos(x, y);
            g.appendChild(cellLayout.render());
            y += cellLayout.height + cellLayout.lyricsRows * 16;
        }
        return g;
    }
}
