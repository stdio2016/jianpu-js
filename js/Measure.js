class Measure {
    /**
     * Create a measure
     * @param {MeasurePart[]} parts
     */
    constructor(parts) {
        this.parts = parts;
    }
}

class MeasurePart {
    /**
     * 
     * @param {Note[]} data
     */
    constructor(data) {
        this.data = data;
    }
}

class MeasurePartLayout extends Layout {
    /**
     * 
     * @param {MeasurePart} measurePart 
     */
    constructor(measurePart) {
        super();
        this.measure = measurePart;
        this.layouts = [];
        this.measure.data.forEach(d => {
            if (d instanceof Note) {
                this.layouts.push(new NoteLayout(d));
            }
        });
        this.recalcSize();
    }

    recalcSize() {
        this.width = this.layouts.reduce((a, b) => a + b.width, 0);
        var dy = this.layouts.reduce(
            (a, b) => Math.max(a, b.dy), 0);
        var bottom = this.layouts.reduce(
            (a, b) => Math.max(a, b.getBottom()), 0);
        this.height = dy + bottom;
        this.dy = dy;
    }

    render() {
        var g = super.render();
        var x = this.x;
        var y = this.getcy();
        for (var lay of this.layouts) {
            lay.setPos(x, y - lay.dy);
            g.appendChild(lay.render());
            x += lay.width;
        }
        return g;
    }
}
