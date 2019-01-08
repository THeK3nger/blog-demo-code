/**
 * Return a random balue according a Normal distribution.
 * @param {number} m The median of the distribution
 * @param {number} sigma The standard deviation of the distribution
 */
function randn_bm(m, sigma) {
    var u = 0;
    var v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return sigma * num + m;
}

/**
 *
 * @param {number} x0 Starting value for the distribution.
 * @param {number} t0 Time zero or previous step
 * @param {number} t The current time.
 * @param {number} sigma Expected variation for the next step
 * @returns {number}
 */
function randomWalk(x0, t0, t, sigma) {
    return randn_bm(x0, (t - t0) * sigma * sigma);
}

/**
 * Generate a simple n-step random walking from x0.
 * @param {number} x0 Starting Value
 * @param {number} sigma Expected variation for each step
 * @param {number} n Number of random walked steps
 * @returns {Array<[number, number]>}
 */
function generateSimpleRandomWalk(x0, sigma, n) {
    let points = [];
    let prevX = x0;
    for (var i = 0; i < n; i++) {
        let x = randomWalk(prevX, i, i + 1, sigma);
        points.push([i, 100 + x * 10]);
        prevX = x;
    }
    return points;
}

window.onload = function() {
    // eslint-disable-next-line no-undef
    const draw = SVG()
        .addTo("#demo1")
        .size(300, 300);
    let line = draw
        .polyline(generateSimpleRandomWalk(0, 0.5, 500))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
};
