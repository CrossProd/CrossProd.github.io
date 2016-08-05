function Camera() {
    this.location = new Vector(0, 0, -5);
    this.target = new Vector(0, 0, 0);
    this.roll = 0.0;
    this.fov = 1.0;
    this.nearPlane = 0.1;
    this.farPlane = 20.0;
}

Camera.prototype = {
    getViewMatrix: function() {
        return Matrix.lookAt(this.location, this.target, this.roll);
    },

    getProjectionMatrix: function() {
        return Matrix.projection(this.fov, Pyramid.ratio, this.nearPlane, this.farPlane);
    }
};
