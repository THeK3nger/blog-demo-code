/**
 * Return a random value according a Normal distribution.
 * @param {number} m The median of the distribution
 * @param {number} sigma The standard deviation of the distribution
 */
function randn_bm(m, sigma) {
    var u = 0;
    var v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.sqrt(sigma) * num + m;
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

window.onload = function() {
    const width = 600;
    const height = 300;
    const margin = 10;
    const pathVScale = 10;

    const originX = margin;
    const originY = height - margin;

    /**
     * Generate a simple n-step random walking from x0.
     * @param {number} x0 Starting Value
     * @param {number} sigma Expected variation for each step
     * @param {number} n Number of random walked steps
     * @returns {Array<[number, number]>}
     */
    const generateSimpleRandomWalk = function(x0, sigma, n) {
        let points = [];
        let prevX = x0;
        for (var i = 0; i < n; i++) {
            let x = randomWalk(prevX, i, i + 1, sigma);
            points.push([i + margin, height / 2 + x * pathVScale]);
            prevX = x;
        }
        return points;
    };

    /**
     * Generate a simple n-step random walking from x0.
     * @param {number} x0 Starting Value
     * @param {number} sigma Expected variation for each step
     * @param {number} n Number of random walked steps
     * @returns {Array<[number, number]>}
     */
    const generateJumpRandomWalk = function(
        x0,
        sigma,
        n,
        jumpStart,
        jumpAmount
    ) {
        let points = [];
        let prevX = x0;
        for (var i = 0; i < n; i++) {
            let x;
            if (i == jumpStart) {
                i = jumpStart + jumpAmount;
                x = randomWalk(prevX, i, i + jumpAmount, sigma);
            } else {
                x = randomWalk(prevX, i, i + 1, sigma);
            }
            if (Math.abs(x) > height / 2) x = height / 2 - x;
            points.push([i + margin, height / 2 + x * pathVScale]);
            prevX = x;
        }
        return points;
    };

    // eslint-disable-next-line no-undef
    const draw = SVG()
        .addTo("#demo1")
        .size(width, height);
    let yAxis = draw
        .line(margin, margin, originX, originY)
        .stroke({ color: "#000", width: 2 });
    let xAxis = draw
        .line(originX, originY, width - margin, height - margin)
        .stroke({ color: "#000", width: 2 });
    let path = draw
        .polyline(generateSimpleRandomWalk(0, 0.3, 600 - 2 * margin))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });

    // eslint-disable-next-line no-undef
    const draw2 = SVG()
        .addTo("#demo2")
        .size(width, height);

    let breakZone = draw2
        .rect(100, height - 2 * margin)
        .fill("#aaa")
        .move(originX + 300, margin);

    let yAxis2 = draw2
        .line(margin, margin, originX, originY)
        .stroke({ color: "#000", width: 2 });

    let xAxis2 = draw2
        .line(originX, originY, width - margin, height - margin)
        .stroke({ color: "#000", width: 2 });

    let points = generateJumpRandomWalk(0, 0.3, 600 - 2 * margin, 300, 100);
    let path2 = draw2
        .polyline(points.slice(0, 300))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
    let path3 = draw2
        .polyline(points.slice(300))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
    let path4 = draw2
        .line([points[299], points[300]])
        .fill("none")
        .stroke({ color: "#f06", width: 2, dasharray: "10 10" });
};
