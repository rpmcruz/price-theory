function Vec(x, y) {
    if(y == undefined) {
        this.x = x.x;
        this.y = x.y;
    }
    else {
        this.x = x;
        this.y = y;
    }
}

Vec.prototype.add = function(other) {
    return new Vec(this.x+other.x, this.y+other.y);
}

Vec.prototype.sub = function(other) {
    return new Vec(this.x-other.x, this.y-other.y);
}

Vec.prototype.mult = function(other) {
    if(typeof other == 'number')
        return new Vec(this.x*other, this.y*other);
    return new Vec(this.x*other.x, this.y*other.y);
}

Vec.prototype.orthogonal = function() {
    return new Vec(-this.y, this.x);
}

Vec.prototype.norm = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec.prototype.normalize = function() {
    var norm = this.norm();
    return new Vec(this.x/norm, this.y/norm);
}

Vec.prototype.toString = function() {
    return '[' + this.x + ', ' + this.y + ']';
}
