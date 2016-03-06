// Utilities common to our econ Javascript applets

//////////////////////////////////// Event handling

function getMousePos(canvas, evt) {
    var r = canvas.getBoundingClientRect();
    return {x: evt.clientX - r.left, y: evt.clientY - r.top};
}

//////////////////////////////////// Geometry

// distance between a point and a line segment
// from: http://stackoverflow.com/a/1501725/2680707

function dist2(vx, vy, wx, wy) {
    return (vx-wx)*(vx-wx) + (vy-wy)*(vy-wy);
}
function distToSegmentSq(px, py, vx, vy, wx, wy) {
    var l2 = dist2(vx, vy, wx, wy);
    if (l2 == 0) return dist2(px, py, vx, vy);
    var t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
    if (t < 0) return dist2(px, py, vx, vy);
    if (t > 1) return dist2(px, py, wx, wy);
    return dist2(px, py, vx + t*(wx-vx), vy + t*(wy-vy));
}

//////////////////////////////////// Random generators

function gauss_rand(mean, sd) {
    // http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html
    if (mean == undefined)
        mean = 0.0;
    if (sd == undefined)
        sd = 1.0;
    var V1, V2, S;
    do {
        var U1 = Math.random();
        var U2 = Math.random();
        V1 = 2 * U1 - 1;
        V2 = 2 * U2 - 1;
        S = V1 * V1 + V2 * V2;
    } while (S > 1);

    X = Math.sqrt(-2 * Math.log(S) / S) * V1;
    X = mean + sd * X;
    //Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
    //Y = mean + sd * Y ;
    return X;
}

