var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

function writeMessage(canvas, message) {
    ctx.clearRect(0, 0, 120, 30);
    ctx.fillStyle = 'black';
    ctx.fillText(message, 10, 25);
}

//////////////////////////////// City

// status:
// -1: hover
//  0: unlocked/normal
//  1: selected1
//  2: selected2

var playersColors = [
    'black', 'blue', 'green', 'brown'
];

City.prototype.draw = function(ctx, status, locked) {
    ctx.beginPath();
    ctx.strokeStyle = locked ? 'gray' : playersColors[this.league+1];
    ctx.lineWidth = 8;
    ctx.arc(this.x, this.y, 8, 0, 2*Math.PI);

    switch(status) {
        case -1: ctx.fillStyle = 'black'; break;
        case 1: ctx.fillStyle = 'blue'; break;
        case 2: ctx.fillStyle = 'green'; break;
        default: ctx.fillStyle = 'white'; break;
    }
    ctx.stroke();
    ctx.fill();
};

