function Vector(x, y, z) {
    if (arguments.length == 0) {
        x = y = z = 0;
    }
    else if (arguments.length == 1) {
        y = z = x;
    }

    this.x = x;
    this.y = y;
    this.z = z;
}

Vector.prototype = {
    toArray: function() {
        return [this.x, this.y, this.z];
    }
};

Vector.subtract = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
};

Vector.magnitude = function(a) {
    return Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
};

Vector.normalize = function(a) {
    var lengthInv = 1.0 / Vector.magnitude(a);

    return new Vector(a.x * lengthInv, a.y * lengthInv, a.z * lengthInv);
};

Vector.dotProduct = function(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

Vector.crossProduct = function(a, b) {
    return new Vector(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
};
