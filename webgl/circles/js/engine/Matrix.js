function Matrix(data) {
    this._11 = 1.0; this._12 = 0.0; this._13 = 0.0; this._14 = 0.0;
    this._21 = 0.0; this._22 = 1.0; this._23 = 0.0; this._24 = 0.0;
    this._31 = 0.0; this._32 = 0.0; this._33 = 1.0; this._34 = 0.0;
    this._41 = 0.0; this._42 = 0.0; this._43 = 0.0; this._44 = 1.0;

    if (arguments.length == 1) {
        this.setFromArray(data);
    }
}

Matrix.prototype = {
    toArray: function() {
        return [
            this._11, this._12, this._13, this._14,
            this._21, this._22, this._23, this._24,
            this._31, this._32, this._33, this._34,
            this._41, this._42, this._43, this._44
        ]
    },

    setFromArray: function(data) {
        this._11 = data[0];  this._12 = data[1];  this._13 = data[2];  this._14 = data[3];
        this._21 = data[4];  this._22 = data[5];  this._23 = data[6];  this._24 = data[7];
        this._31 = data[8];  this._32 = data[9];  this._33 = data[10]; this._34 = data[11];
        this._41 = data[12]; this._42 = data[13]; this._43 = data[14]; this._44 = data[15];
    },
    
    inversed: function() {

        //    b00 = this._11 * this._22 - this._12 * this._21;
        //    b01 = this._11 * this._23 - this._13 * this._21;
        //    b02 = this._11 * this._24 - this._14 * this._21;
        //    b03 = this._12 * this._23 - this._13 * this._22;
        //    b04 = this._12 * this._24 - this._14 * this._22;
        //    b05 = this._13 * this._24 - this._14 * this._23;
        //    b06 = this._31 * this._42 - this._32 * this._41;
        //    b07 = this._31 * this._43 - this._33 * this._41;
        //    b08 = this._31 * this._44 - this._34 * this._41;
        //    b09 = this._32 * this._43 - this._33 * this._42;
        //    b10 = this._32 * this._44 - this._34 * this._42;
        //    b11 = this._33 * this._44 - this._34 * this._43;
        //
        //    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        //
        //
        //if (!det) {
        //    return null;
        //}
        //
        //det = 1.0 / det;
        //
        //var out = [];
        //
        //out[0] = (this._22 * b11 - this._23 * b10 + this._24 * b09) * det;
        //out[1] = (this._13 * b10 - this._12 * b11 - this._14 * b09) * det;
        //out[2] = (this._42 * b05 - this._43 * b04 + this._44 * b03) * det;
        //out[3] = (this._33 * b04 - this._32 * b05 - this._34 * b03) * det;
        //out[4] = (this._23 * b08 - this._21 * b11 - this._24 * b07) * det;
        //out[5] = (this._11 * b11 - this._13 * b08 + this._14 * b07) * det;
        //out[6] = (this._43 * b02 - this._41 * b05 - this._44 * b01) * det;
        //out[7] = (this._31 * b05 - this._33 * b02 + this._34 * b01) * det;
        //out[8] = (this._31 * b10 - this._22 * b08 + this._24 * b06) * det;
        //out[9] = (this._12 * b08 - this._11 * b10 - this._14 * b06) * det;
        //out[10] = (this._41 * b04 - this._42 * b02 + this._44 * b00) * det;
        //out[11] = (this._32 * b02 - this._31 * b04 - this._34 * b00) * det;
        //out[12] = (this._22 * b07 - this._21 * b09 - this._23 * b06) * det;
        //out[13] = (this._11 * b09 - this._12 * b07 + this._13 * b06) * det;
        //out[14] = (this._42 * b01 - this._41 * b03 - this._43 * b00) * det;
        //out[15] = (this._31 * b03 - this._32 * b01 + this._33 * b00) * det;
        //
        //return new Matrix(out);
        

        var fDetInv = 1.0 / (this._11 * (this._22 * this._33 - this._23 * this._32) -
                             this._12 * (this._21 * this._33 - this._23 * this._31) +
                             this._13 * (this._21 * this._32 - this._22 * this._31));

        var result = new Matrix();

        result._11 =  fDetInv * (this._22 * this._33 - this._23 * this._32);
        result._12 = -fDetInv * (this._12 * this._33 - this._13 * this._32);
        result._13 =  fDetInv * (this._12 * this._23 - this._13 * this._22);

        result._21 = -fDetInv * (this._21 * this._33 - this._23 * this._31);
        result._22 =  fDetInv * (this._11 * this._33 - this._13 * this._31);
        result._23 = -fDetInv * (this._11 * this._23 - this._13 * this._21);

        result._31 =  fDetInv * (this._21 * this._32 - this._22 * this._31);
        result._32 = -fDetInv * (this._11 * this._32 - this._12 * this._31);
        result._33 =  fDetInv * (this._11 * this._22 - this._12 * this._21);

        result._41 = -(this._41 * result._11 + this._42 * result._21 + this._43 * result._31);
        result._42 = -(this._41 * result._12 + this._42 * result._22 + this._43 * result._32);
        result._43 = -(this._41 * result._13 + this._42 * result._23 + this._43 * result._33);

        return result;
    },
    
    transposed: function() {
        var result = new Matrix();

        result._11 = this._11;
        result._21 = this._12;
        result._31 = this._13;
        result._41 = this._14;

        result._12 = this._21;
        result._22 = this._22;
        result._32 = this._23;
        result._42 = this._24;

        result._13 = this._31;
        result._23 = this._32;
        result._33 = this._33;
        result._43 = this._34;

        result._14 = this._41;
        result._24 = this._42;
        result._34 = this._43;
        result._44 = this._44;

        return result;
    },

    logToConsole: function() {
        var data = this.toArray();

        for (var y = 0; y < 4; y++) {
            var line = '';

            for (var x = 0; x < 4; x++) {
                line += (x > 0) ? ', ' : '';
                line += data[(y * 4) + x];
            }

            console.log(line);
        }
    }
};

Matrix.rotation = function(x, y, z) {
    var matX = Matrix.rotationX(x);
    var matY = Matrix.rotationY(y);
    var matZ = Matrix.rotationZ(z);

    return Matrix.multiply(matX, Matrix.multiply(matZ, matY));
};

Matrix.rotationX = function(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return new Matrix([
        1, 0,  0, 0,
        0, c, -s, 0,
        0, s,  c, 0,
        0, 0,  0, 1
    ]);
};

Matrix.rotationY = function(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return new Matrix([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ]);
};

Matrix.rotationZ = function(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return new Matrix([
        c, -s, 0, 0,
        s,  c, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1
    ]);
};

Matrix.scaleX = function(s) {
    return new Matrix([
        s, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};

Matrix.scaleY = function(s) {
    return new Matrix([
        1, 0, 0, 0,
        0, s, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};

Matrix.scaleZ = function(s) {
    return new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, s, 0,
        0, 0, 0, 1
    ]);
};

Matrix.scale = function(sx, sy, sz) {
    if (arguments.length == 1) {
        sy = sz = sx;
    }

    return new Matrix([
        sx,  0,  0, 0,
        0, sy,  0, 0,
        0,  0, sz, 0,
        0,  0,  0, 1
    ]);
};

Matrix.translation = function(x, y, z) {
    return new Matrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ]);
};

Matrix.projection = function(fov, aspect, near, far) {
    var result = new Matrix();

    result._11 = (1.0 / aspect) * (1.0 / Math.tan(fov * 0.5));
    result._22 = 1.0 / Math.tan(fov * 0.5);
    result._33 = (-(far + near)) / (far - near);
    result._34 = 1;
    result._43 = (2 * far * near) / (far - near);

    return result;
};

Matrix.multiply = function(a, b) {
    var result = [];

    a = a.toArray();
    b = b.toArray();

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            result[(y * 4) + x] = 0;

            for (var i = 0; i < 4; i++) {
                result[(y * 4) + x] += a[(i * 4) + x] * b[(y * 4) + i];
            }
        }
    }

    return new Matrix(result);
};

Matrix.lookAt = function(position, target, roll) {
    var z = Vector.normalize(Vector.subtract(target, position));
    var x = Vector.crossProduct(new Vector(0, 1.0, 0), z);
    var y = Vector.crossProduct(z, x);

    var result = new Matrix([
        x.x, y.x, z.x, 0,
        x.y, y.y, z.y, 0,
        x.z, y.z, z.z, 0,
        -Vector.dotProduct(x, position), -Vector.dotProduct(y, position), -Vector.dotProduct(z, position), 1
    ]);

    return Matrix.multiply(result, Matrix.rotationZ(roll));
};
