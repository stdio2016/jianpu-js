class Lyric {
    /**
     * Create a lyric syllable
     * @param {string|{text:string}} lyric
     */
    constructor(lyric) {
        if (typeof lyric === 'string') {
            this.text = lyric;
        } else {
            this.text = lyric.text;
        }
    }
}
