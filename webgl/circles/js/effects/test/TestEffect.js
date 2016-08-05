function TestEffect() {
    Effect.call(this);

    this.config = {
        resources: {
            textures: {},
            shaders: {
                render: {
                    vs: "js/effects/test/shaders/render.vs",
                    fs: "js/effects/test/shaders/render.fs",
                    attributes: {
                        aPosition: {
                            size: 3,
                            vertexBuffer: "positions"
                        },
                        aNormal: {
                            size: 3,
                            vertexBuffer: "normals"
                        }
                    },
                    uniforms: {
                        uModelMat: {
                            value: null
                        },
                        uViewMat: {
                            value: null
                        },
                        uProjMat: {
                            value: null
                        },
                        uModelViewMat: {
                            value: null
                        },
                        uModelViewProjMat: {
                            value: null
                        },
                        uInversedModelMat: {
                            value: null
                        },
                        uCameraLocation: {
                            value: null
                        },
                        uLightPosition: {
                            value: [
                                10, 3, -5
                            ]
                        }
                    }
                }
            }
        }
    };

    this.scene = new Scene();
}

TestEffect.prototype = Object.extend(Effect.prototype, {

    initialize: function() {
        Effect.prototype.initialize.call(this);

        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                for (var z = 0; z < 3; z++) {
                    var mesh = new Mesh();

                    mesh.location = new Vector(0.0 + (x * 3.0 - 3.0), 0.0 + y * 3.0 - 3.0, 0.0 + (z * 3.0 - 3.0));

                    mesh.vertices = [
                        // Front face
                        -1.0, -1.0,  1.0,
                        1.0, -1.0,  1.0,
                        1.0,  1.0,  1.0,
                        -1.0,  1.0,  1.0,

                        // Back face
                        -1.0, -1.0, -1.0,
                        -1.0,  1.0, -1.0,
                        1.0,  1.0, -1.0,
                        1.0, -1.0, -1.0,

                        // Top face
                        -1.0,  1.0, -1.0,
                        -1.0,  1.0,  1.0,
                        1.0,  1.0,  1.0,
                        1.0,  1.0, -1.0,

                        // Bottom face
                        -1.0, -1.0, -1.0,
                        1.0, -1.0, -1.0,
                        1.0, -1.0,  1.0,
                        -1.0, -1.0,  1.0,

                        // Right face
                        1.0, -1.0, -1.0,
                        1.0,  1.0, -1.0,
                        1.0,  1.0,  1.0,
                        1.0, -1.0,  1.0,

                        // Left face
                        -1.0, -1.0, -1.0,
                        -1.0, -1.0,  1.0,
                        -1.0,  1.0,  1.0,
                        -1.0,  1.0, -1.0
                    ];

                    mesh.indices = [
                        0,  1,  2,      0,  2,  3,    // front
                        4,  5,  6,      4,  6,  7,    // back
                        8,  9,  10,     8,  10, 11,   // top
                        12, 13, 14,     12, 14, 15,   // bottom
                        16, 17, 18,     16, 18, 19,   // right
                        20, 21, 22,     20, 22, 23    // left
                    ];

                    mesh.shaderPrograms[0] = this.resources.programs['render'];

                    this.scene.meshes.push(mesh);
                }
            }
        }

        this.scene.initialize();
    },

    render: function(timer) {
        Pyramid.clear();

        this.scene.camera.location = new Vector(Math.sin(timer * 0.5) * 10.0, 0, Math.cos(timer * 0.5) * -10.0);

        this.scene.renderPass(0);
    }
});
