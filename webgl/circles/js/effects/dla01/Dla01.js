function Dla01Mesh() {
    Mesh.call(this);

    this.color = [1, 1, 1];
    this.centers = [];
    this.generations = [];
    this.timer = 0;
}

Dla01Mesh.prototype = Object.extend(Mesh.prototype, {

    initialize: function() {
        Mesh.prototype.initialize.call(this);

        this.vertexBuffers['centers'] = Pyramid.createVertexBuffer(this.centers);
        this.vertexBuffers['generations'] = Pyramid.createVertexBuffer(this.generations);
    },

    prepareShaderProgram: function(pass, modelMatrix, viewMatrix, projectionMatrix, camera) {
        Mesh.prototype.prepareShaderProgram.call(this, pass, modelMatrix, viewMatrix, projectionMatrix, camera);

        var shaderProgram = this.shaderPrograms[pass];

        shaderProgram.uniforms['uColor'].value = this.color;
        shaderProgram.uniforms['uTimer'].value = [this.timer];
    }
});

function Dla01() {
    Effect.call(this);

    this.config = {
        resources: {
            textures: {},
            shaders: {
                render: {
                    vs: "js/effects/dla01/shaders/render.vs",
                    fs: "js/effects/dla01/shaders/render.fs",
                    attributes: {
                        aPosition: {
                            size: 3,
                            vertexBuffer: "positions"
                        },
                        aNormal: {
                            size: 3,
                            vertexBuffer: "normals"
                        },
                        aCenter: {
                            size: 3,
                            vertexBuffer: "centers"
                        },
                        aGeneration: {
                            size: 1,
                            vertexBuffer: "generations"
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
                        },
                        uColor: {
                            value: [
                                1, 1, 1
                            ]
                        },
                        uTimer: {
                            value: 0
                        }
                    }
                }
            }
        }
    };

    this.scene = new Scene();

    this.xSize = 70;
    this.ySize = 70;
    this.zSize = 70;

    this.nrOfColors = 5;

    this.colorList = [
        new Vector(0xD3 / 255.0, 0xD2 / 255.0, 0xCD / 255.0), // white
        new Vector(0xF4 / 255.0, 0x67 / 255.0, 0x06 / 255.0), // orange
        new Vector(0x81 / 255.0, 0x7E / 255.0, 0x57 / 255.0), // green
        new Vector(0x92 / 255.0, 0x0E / 255.0, 0x07 / 255.0), // red
        new Vector(0x2E / 255.0, 0x30 / 255.0, 0x26 / 255.0)  // dark green
    ];
}

Dla01.prototype = Object.extend(Effect.prototype, {

    initialize: function() {
        Effect.prototype.initialize.call(this);

        console.log("Starting DLA generation.");

        var dlaHelper = new DlaHelper(this.xSize, this.ySize, this.zSize);

        var nrOfSeeds = 150;
        var nrOfCubes = 7000;

        Random.seed = 4533454;

        for (var colorIndex = 0; colorIndex < this.nrOfColors; colorIndex++) {
            for (var i = 0; i < nrOfSeeds; i++) {
                var x = Random.integer() % this.xSize;
                var y = Random.integer() % this.ySize;
                var z = Random.integer() % this.zSize;

                console.log(x + ", " + y + ", " + z);

                dlaHelper.addSeedAtPos(x, y, z, Math.floor(i / 4), colorIndex);
            }
        }

        for (var i = 0; i < nrOfCubes - nrOfSeeds; i++) {
            for (var colorIndex = 0; colorIndex < this.nrOfColors; colorIndex++) {
                if (i % 1000 == 0) {
                    console.log("DLA generation: " + i);
                }

                dlaHelper.addParticleAtRandomPos(colorIndex);
            }
        }

        console.log("Finished DLA generation.");

        var xSize = this.xSize;
        var ySize = this.ySize;
        var zSize = this.zSize;

        var scene = this.scene;

        var resources = this.resources;

        var vertices = [
            new Vector(-1.0, -1.0,  1.0),
            new Vector(1.0, -1.0,  1.0),
            new Vector(1.0,  1.0,  1.0),
            new Vector(-1.0,  1.0,  1.0),

            new Vector(-1.0, -1.0, -1.0),
            new Vector(-1.0,  1.0, -1.0),
            new Vector(1.0,  1.0, -1.0),
            new Vector(1.0, -1.0, -1.0),

            new Vector(-1.0,  1.0, -1.0),
            new Vector(-1.0,  1.0,  1.0),
            new Vector(1.0,  1.0,  1.0),
            new Vector(1.0,  1.0, -1.0),

            new Vector(-1.0, -1.0, -1.0),
            new Vector(1.0, -1.0, -1.0),
            new Vector(1.0, -1.0,  1.0),
            new Vector(-1.0, -1.0,  1.0),

            new Vector(1.0, -1.0, -1.0),
            new Vector(1.0,  1.0, -1.0),
            new Vector(1.0,  1.0,  1.0),
            new Vector(1.0, -1.0,  1.0),

            new Vector(-1.0, -1.0, -1.0),
            new Vector(-1.0, -1.0,  1.0),
            new Vector(-1.0,  1.0,  1.0),
            new Vector(-1.0,  1.0, -1.0)
        ];

        var indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ];

        for (var i = 0; i < this.nrOfColors; i++) {
            var mesh = new Dla01Mesh();

            mesh.color = this.colorList[i].toArray();
            mesh.shaderPrograms[0] = resources.programs['render'];

            scene.meshes.push(mesh);
        }

        dlaHelper.takenPositions.forEach(function(location, index) {
            var item = dlaHelper.grid[location.z][location.y][location.x];

            var mesh = scene.meshes[item.data];

            var startIndex = mesh.vertices.length / 3;

            vertices.forEach(function(vertex) {
                var x = (location.x - (xSize * 0.5)) * 2.0;
                var y = (location.y - (ySize * 0.5)) * 2.0;
                var z = (location.z - (zSize * 0.5)) * 2.0;

                mesh.vertices.push(x + vertex.x);
                mesh.vertices.push(y + vertex.y);
                mesh.vertices.push(z + vertex.z);

                mesh.centers.push(x);
                mesh.centers.push(y);
                mesh.centers.push(z);

                mesh.generations.push(item.generation);
            });

            indices.forEach(function(index) {
                mesh.indices.push(index + startIndex)
            });
        });

        this.scene.initialize();

        this.scene.camera.farPlane = 100.0;
    },

    render: function(timer) {
        Pyramid.clear();

        for (var i = 0; i < this.nrOfColors; i++) {
            this.scene.meshes[i].timer = (timer * 1.0) - (i * 2.0) + (Math.sin(timer * 2.0) * 1.0);
        }

        this.scene.camera.location = new Vector(Math.sin(timer * 0.5) * 100.0, Math.cos(timer * 0.3667) * 50.0, Math.cos(timer * 0.5) * 100.0);
        this.scene.camera.roll = Math.cos(timer * 0.2);

        this.scene.renderPass(0);
    }
});
