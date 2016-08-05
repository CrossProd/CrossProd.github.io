function Scene() {
    this.meshes = [];
    this.camera = new Camera();
}

Scene.prototype = {
    initialize: function() {
        this.meshes.forEach(function(mesh) {
            mesh.initialize();
        });
    },

    renderPass: function(pass) {
        var projectionMatrix = this.camera.getProjectionMatrix();
        var viewMatrix = this.camera.getViewMatrix();

        var camera = this.camera;

        this.meshes.forEach(function(mesh) {
            mesh.renderPass(pass, viewMatrix, projectionMatrix, camera);
        });
    }
};
