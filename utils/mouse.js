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

