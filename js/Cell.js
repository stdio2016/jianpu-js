class Cell {
    /**
     * A cell holds notes in one measure, one staff
     * @param {Note[]} data
     */
    constructor(data) {
        this.data = data;
    }
}

class CellLayout extends Layout {
    /**
     * 
     * @param {Cell} cell 
     */
    constructor(cell) {
        super();
        this.cell = cell;
        this.layouts = [];
        this.cell.data.forEach(d => {
            if (d instanceof Note) {
                var lay = new NoteLayout(d);
                this.layouts.push(lay);
                this.layouts.push(...lay.dashLayout);
            }
        });
        this.recalcSize();
    }

    forEach() {

    }

    recalcSize() {
        this.width = this.layouts.reduce((a, b) => a + b.width, 0);
        var dy = this.layouts.reduce(
            (a, b) => Math.max(a, b.dy), 0);
        var bottom = this.layouts.reduce(
            (a, b) => Math.max(a, b.getdy2()), 0);
        this.height = dy + bottom;
        this.dy = dy;
    }

    render() {
        var g = super.render();
        var x = this.x;
        var y = this.getby();
        for (var lay of this.layouts) {
            lay.setPos(x, y - lay.dy);
            g.appendChild(lay.render());
            x += lay.width;
        }
        return g;
    }
}
