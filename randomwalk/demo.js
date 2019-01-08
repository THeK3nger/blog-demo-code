function randn_bm(m, sigma) {
    var u = 0;
    var v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return sigma * num + m;
}

function randomWalk(x0, t0, t, sigma) {
    return randn_bm(x0, (t - t0) * sigma * sigma);
}

let points = [];
let prevX = 0;
for (var i = 0; i < 500; i++) {
    let x = randomWalk(prevX, i, i + 1, 0.5);
    points.push([i, 100 + x * 10]);
    prevX = x;
}

window.onload = function() {
    // eslint-disable-next-line no-undef
    let draw = SVG()
        .addTo("#demo1")
        .size(300, 300);
    let line = draw
        .polyline(points)
        .fill("none")
        .stroke({ color: "#f06", width: 2 });
};
