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
 * @param {number} deltaT Time distance from x0.
 * @param {number} sigma Expected variation for the next step
 * @returns {number}
 */
function randomWalk(x0, deltaT, sigma) {
    return randn_bm(x0, deltaT * sigma * sigma);
}

/**
 * Sample a random walk distribution that converges to xn when t converges to tn.
 *
 * @param {number} x0 Starting value for the distribution.
 * @param {number} t0 Time zero of the previous step.
 * @param {number} xn Interpolated value
 * @param {number} tn Interpolation time
 * @param {number} t The current time.
 * @param {number} sigma Expected variation for the next step.
 */
function randomWalkIntepolated(x0, t0, xn, tn, t, sigma) {
    const sigma2 = sigma * sigma;
    const t0denominator = (t - t0) * sigma2;
    const tndenominator = (tn - t) * sigma2;
    const fullDenominator = 1 / t0denominator + 1 / tndenominator;
    const mean = (x0 / t0denominator + xn / tndenominator) / fullDenominator;
    const variance = 1 / fullDenominator;
    return randn_bm(mean, variance);
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
            let x = randomWalk(prevX, 1, sigma);
            points.push([i + margin, height / 2 + x * pathVScale]);
            prevX = x;
        }
        return points;
    };

    /**
     * Generate a simple n-step random walking from x0 that jumps at some point.
     * @param {number} x0 Starting Value
     * @param {number} sigma Expected variation for each step
     * @param {number} n Number of random walked steps
     * @param {number} jumpStart When the jump starts.
     * @param {number} jumpAmount Length of the jump.
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
                x = randomWalk(prevX, jumpAmount, sigma);
            } else {
                x = randomWalk(prevX, 1, sigma);
            }
            if (Math.abs(x) > height / 2) x = height / 2 - x;
            points.push([i + margin, height / 2 + x * pathVScale]);
            prevX = x;
        }
        return points;
    };

    /**
     * Generate a simple n-step random walking from x0 and
     * converges to xn when we get closer to tn.
     * @param {number} x0 Starting Value
     * @param {number} sigma Expected variation for each step
     * @param {number} n Number of random walked steps
     * @param {number} xn The interpolated value.
     * @param {number} tn The interpolation time.
     *
     * @returns {Array<[number, number]>}
     */
    const generateInterpolatedRandomWalk = function(x0, sigma, xn, tn, n) {
        let points = [];
        let prevX = x0;
        for (var i = 0; i < n; i++) {
            if (i + 1 !== tn && i + 1 !== tn - 1 && i + 1 !== tn + 1) {
                let x;
                if (i + 1 < tn) {
                    x = randomWalkIntepolated(prevX, i, xn, tn, i + 1, sigma);
                } else {
                    x = randomWalk(prevX, 1, sigma);
                }
                points.push([i + margin, height / 2 + x * pathVScale]);
                prevX = x;
            } else {
                points.push([i + margin, height / 2 + xn * pathVScale]);
                prevX = xn;
            }
        }
        return points;
    };

    drawExample1(
        width,
        height,
        margin,
        originX,
        originY,
        generateSimpleRandomWalk
    );

    drawExample2(
        width,
        height,
        margin,
        originX,
        originY,
        generateJumpRandomWalk
    );

    drawExample3(
        width,
        height,
        margin,
        originX,
        originY,
        generateInterpolatedRandomWalk
    );
};

function drawExample3(
    width,
    height,
    margin,
    originX,
    originY,
    generateInterpolatedRandomWalk
) {
    // eslint-disable-next-line no-undef
    const draw3 = SVG()
        .addTo("#demo3")
        .size(width, height);
    draw3
        .line(margin, margin, originX, originY)
        .stroke({ color: "#000", width: 2 });
    draw3
        .line(originX, originY, width - margin, height - margin)
        .stroke({ color: "#000", width: 2 });
    draw3
        .polyline(
            generateInterpolatedRandomWalk(0, 0.3, 5, 300, 600 - 2 * margin)
        )
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
    let pointRadius = 10;
    draw3
        .circle(pointRadius)
        .fill("#000")
        .move(
            300 + margin - pointRadius / 2,
            50 + height / 2 - pointRadius / 2
        );
}

function drawExample2(
    width,
    height,
    margin,
    originX,
    originY,
    generateJumpRandomWalk
) {
    // eslint-disable-next-line no-undef
    const draw2 = SVG()
        .addTo("#demo2")
        .size(width, height);
    draw2
        .rect(100, height - 2 * margin)
        .fill("#aaa")
        .move(originX + 300, margin);
    draw2
        .line(margin, margin, originX, originY)
        .stroke({ color: "#000", width: 2 });
    draw2
        .line(originX, originY, width - margin, height - margin)
        .stroke({ color: "#000", width: 2 });
    let points = generateJumpRandomWalk(0, 0.3, 600 - 2 * margin, 300, 100);
    draw2
        .polyline(points.slice(0, 300))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
    draw2
        .polyline(points.slice(300))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
    draw2
        .line([points[299], points[300]])
        .fill("none")
        .stroke({ color: "#f06", width: 2, dasharray: "10 10" });
}

function drawExample1(
    width,
    height,
    margin,
    originX,
    originY,
    generateSimpleRandomWalk
) {
    // eslint-disable-next-line no-undef
    const draw = SVG()
        .addTo("#demo1")
        .size(width, height);
    draw.line(margin, margin, originX, originY).stroke({
        color: "#000",
        width: 2
    });
    draw.line(originX, originY, width - margin, height - margin).stroke({
        color: "#000",
        width: 2
    });
    draw.polyline(generateSimpleRandomWalk(0, 0.3, 600 - 2 * margin))
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
}
