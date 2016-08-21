// (C) 2016 Ricardo Cruz
// Add vector functionality to Array

Array.prototype.add = function(other) {
    console.assert(this.length == other.length, 'add: len(a) != len(b)');
    var ret = new Array(this.length);
    for(var i = 0; i < ret.length; i++)
        ret[i] = this[i] + other[i];
    return ret;
}

Array.prototype.sub = function(other) {
    console.assert(this.length == other.length, 'sub: len(a) != len(b)');
    var ret = new Array(this.length);
    for(var i = 0; i < ret.length; i++)
        ret[i] = this[i] - other[i];
    return ret;
}

Array.prototype.mult = function(other) {
    if(isFinite(other))  // is number
        other = new Array(this.length).fill(other);
    else
        console.assert(this.length == other.length, 'mult: len(a) != len(b)');
    var ret = new Array(this.length);
    for(var i = 0; i < ret.length; i++)
        ret[i] = this[i] * other[i];
    return ret;
}

Array.prototype.normalize = function() {
    var sum2 = 0;
    for(var i = 0; i < this.length; i++)
        sum2 += Math.pow(this[i], 2);
    var norm2 = Math.sqrt(sum2);
    return this.mult(1/norm2);
}

Array.prototype.ortho = function() {
    return new Array(this[1], -this[0]);
}
