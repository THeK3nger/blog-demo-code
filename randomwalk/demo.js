function randn_bm(m,sigma) {
    var u = 0;
    var v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return sigma*num + m;
}


function randomWalk(x0, t0, t, sigma) {
    return randn_bm(x0, (t-t0)*sigma*sigma);
}

let prevX = 0;
for (var i=0;i<100;i++) {
    let x = randomWalk(prevX, i, i+1, 0.5);
    prevX = x;
    console.log(x);
}