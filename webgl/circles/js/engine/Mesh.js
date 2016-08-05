MeshReservedUniforms = {
    modelMatrix: 'uModelMat',
    viewMatrix: 'uViewMat',
    projMatrix: 'uProjMat',
    modelViewMatrix: 'uModelViewMat',
    modelViewProjMatrix: 'uModelViewProjMat',
    inversedModelMatrix: 'uInversedModelMat',
    cameraLocation: 'uCameraLocation'
};

function Mesh() {
    this.location = new Vector();
    this.rotation = new Vector();

    this.vertices = [];
    this.indices = [];
    this.normals = [];

    this.vertexBuffers = [];
    this.indexBuffer = null;

    this.shaderPrograms = [];
}

Mesh.prototype = {
    initialize: function() {
        this.calculateIndexedTrianglesNormals();

        this.vertexBuffers['positions'] = Pyramid.createVertexBuffer(this.vertices);
        this.vertexBuffers['normals'] = Pyramid.createVertexBuffer(this.normals);

        this.indexBuffer = Pyramid.createIndexBuffer(this.indices, 16);
    },

    getModelMatrix: function() {
        var matrixR = Matrix.rotation(this.rotation.x, this.rotation.y, this.rotation.z);
        var matrixT = Matrix.translation(this.location.x, this.location.y, this.location.z);

        return Matrix.multiply(matrixT, matrixR);
    },

    renderPass: function(pass, viewMatrix, projectionMatrix, camera) {
        var modelMatrix = this.getModelMatrix();

        this.prepareShaderProgram(pass, modelMatrix, viewMatrix, projectionMatrix, camera);

        this.bindIndexBuffer();

        Pyramid.useShaderProgram(this.shaderPrograms[pass]);

        Pyramid.gl.drawElements(Pyramid.gl.TRIANGLES, this.indices.length, Pyramid.gl.UNSIGNED_SHORT, 0);
    },

    prepareShaderProgram: function(pass, modelMatrix, viewMatrix, projectionMatrix, camera) {
        var shaderProgram = this.shaderPrograms[pass];

        var modelViewMatrix = Matrix.multiply(viewMatrix, modelMatrix);
        var inversedModelMatrix = modelMatrix.inversed().transposed();

        if (shaderProgram.uniforms[MeshReservedUniforms.modelMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.modelMatrix].value = modelMatrix.toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.viewMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.viewMatrix].value = viewMatrix.toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.projMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.projMatrix].value = projectionMatrix.toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.modelViewMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.modelViewMatrix].value = modelViewMatrix.toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.modelViewProjMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.modelViewProjMatrix].value = Matrix.multiply(projectionMatrix, modelViewMatrix).toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.inversedModelMatrix]) {
            shaderProgram.uniforms[MeshReservedUniforms.inversedModelMatrix].value = inversedModelMatrix.toArray();
        }

        if (shaderProgram.uniforms[MeshReservedUniforms.cameraLocation]) {
            shaderProgram.uniforms[MeshReservedUniforms.cameraLocation].value = camera.location.toArray();
        }

        for (var key in shaderProgram.attributes) {
            var attribute = shaderProgram.attributes[key];

            attribute.vertexBuffer = this.vertexBuffers[attribute.vertexBufferKey];
        }
    },

    bindVertexBuffers: function() {
        Pyramid.bindVertexBuffer(this.vertexBuffer);
    },

    bindIndexBuffer: function() {
        Pyramid.bindIndexBuffer(this.indexBuffer);
    },

    calculateNormals: function() {
        this.calculateIndexedTrianglesNormals();
    },

    calculateIndexedTrianglesNormals: function() {
        var normalCounter = [];

        for (var i = 0; i < this.vertices.length; i++)  {
            this.normals[i * 3 + 0] = 0;
            this.normals[i * 3 + 1] = 0;
            this.normals[i * 3 + 2] = 0;

            normalCounter[i] = 0;
        }


        for (var i = 0; i < this.indices.length; i++)  {
            var a = this.indices[i * 3 + 0] * 3;
            var b = this.indices[i * 3 + 1] * 3;
            var c = this.indices[i * 3 + 2] * 3;

            var relx1 = this.vertices[b + 0] - this.vertices[a + 0];
            var rely1 = this.vertices[b + 1] - this.vertices[a + 1];
            var relz1 = this.vertices[b + 2] - this.vertices[a + 2];

            var relx2 = this.vertices[c + 0] - this.vertices[a + 0];
            var rely2 = this.vertices[c + 1] - this.vertices[a + 1];
            var relz2 = this.vertices[c + 2] - this.vertices[a + 2];

            var normal = new Vector((rely1 * relz2) - (relz1 * rely2), (relz1 * relx2) - (relx1 * relz2), (relx1 * rely2) - (rely1 * relx2));

            normal = Vector.normalize(normal);

            this.normals[a + 0] = this.normals[a + 0] + normal.x;
            this.normals[a + 1] = this.normals[a + 1] + normal.y;
            this.normals[a + 2] = this.normals[a + 2] + normal.z;

            this.normals[b + 0] = this.normals[b + 0] + normal.x;
            this.normals[b + 1] = this.normals[b + 1] + normal.y;
            this.normals[b + 2] = this.normals[b + 2] + normal.z;

            this.normals[c + 0] = this.normals[c + 0] + normal.x;
            this.normals[c + 1] = this.normals[c + 1] + normal.y;
            this.normals[c + 2] = this.normals[c + 2] + normal.z;

            normalCounter[this.indices[i * 3 + 0]]++;
            normalCounter[this.indices[i * 3 + 1]]++;
            normalCounter[this.indices[i * 3 + 2]]++;
        }

        for (var i = 0; i < this.vertices.length; i++) {
            if (normalCounter[i] == 0) {
                continue;
            }

            var scale = 1.0 / normalCounter[i];

            var x = this.normals[i * 3 + 0] * scale;
            var y = this.normals[i * 3 + 1] * scale;
            var z = this.normals[i * 3 + 2] * scale;

            var lengthInv = 1.0 / Math.sqrt((x * x) + (y * y) + (z * z));

            this.normals[i * 3 + 0] = x * lengthInv;
            this.normals[i * 3 + 1] = y * lengthInv;
            this.normals[i * 3 + 2] = z * lengthInv;
        }
    }
};
