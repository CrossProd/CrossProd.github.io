function CircleMesh() {
    Mesh.call(this);

    this.uv = [];
    this.color = [1, 1, 1];
    this.timer = 0;
}

CircleMesh.prototype = Object.extend(Mesh.prototype, {

    initialize: function() {
        Mesh.prototype.initialize.call(this);

        this.vertexBuffers['uv'] = Pyramid.createVertexBuffer(this.uv);
    },

    prepareShaderProgram: function(pass, modelMatrix, viewMatrix, projectionMatrix, camera) {
        Mesh.prototype.prepareShaderProgram.call(this, pass, modelMatrix, viewMatrix, projectionMatrix, camera);

        var shaderProgram = this.shaderPrograms[pass];

        shaderProgram.uniforms['uColor'].value = this.color;
    }
});


function Circles() {
    Effect.call(this);

    this.nrOfRings = 50;

    this.config = {
        resources: {
            shaders: {
                render: {
                    vs: "js/effects/circles/shaders/render.vert",
                    fs: "js/effects/circles/shaders/render.frag",
                    attributes: {
                        aPosition: {
                            size: 3,
                            vertexBuffer: "positions"
                        },
                        aUV: {
                            size: 2,
                            vertexBuffer: "uv"
                        }
                    },
                    uniforms: {
                        uModelViewProjMat: {
                            value: null
                        },
                        uColor: {
                            value: [
                                1, 1, 1
                            ]
                        }
                    }
                }
            }
        }
    };

    this.scene = new Scene();

    this.nrOfColors = 5;

    this.colorList = [
        Colors.hexToVector('396994'),
        Colors.hexToVector('ff99ff'),
        Colors.hexToVector('ff9a66'),
        Colors.hexToVector('67ff64'),
        Colors.hexToVector('01ffff')
    ];

    this.directions = [];

    Random.seed = 4281234;

    for (var i = 0; i < this.nrOfRings; i++) {
        this.directions[i] = (Random.float() - 0.5) * 1.5;
    }
}

Circles.prototype = Object.extend(Effect.prototype, {

    initialize: function() {
        Effect.prototype.initialize.call(this);

        var scene = this.scene;
        var resources = this.resources;

        var vertices = [
            new Vector(-1.0, -1.0,  0.0),
            new Vector( 1.0, -1.0,  0.0),
            new Vector( 1.0,  1.0,  0.0),
            new Vector(-1.0,  1.0,  0.0)
        ];

        var uvs = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];

        var indices = [
            0,  1,  2,
            0,  2,  3
        ];

        var nrOfRings = this.nrOfRings;

        var combinedRadius = 0.0;

        for (var ring = 0; ring < nrOfRings; ring++) {
            var nrOfCircles = 1 + (ring * (5 + (ring >> 4)));

            // http://math.stackexchange.com/questions/12166/numbers-of-circles-around-a-circle
            var x = ((nrOfCircles - 2) / (2 * nrOfCircles)) * Math.PI;
            var circleRadius = ring == 0 ? 1.0 : (( Math.cos(x) / (1.0 - Math.cos(x))) * combinedRadius);

            var ringRadius = combinedRadius + (ring > 0 ? circleRadius : 0.0);

            var mesh = new CircleMesh();

            mesh.color = this.colorList[ring % 5].toArray();
            mesh.shaderPrograms[0] = resources.programs['render'];

            scene.meshes.push(mesh);

            for (var circle = 0; circle < nrOfCircles; circle++) {

                var startIndex = mesh.vertices.length / 3;

                var rotX = Math.sin((circle / nrOfCircles) * Math.PI * 2.0);
                var rotY = Math.cos((circle / nrOfCircles) * Math.PI * 2.0);

                var vertexIndex = 0;
                vertices.forEach(function (vertex) {
                    var location = new Vector(ringRadius * rotX, ringRadius * rotY, 0);

                    mesh.vertices.push(location.x + (vertex.x * circleRadius * 0.9));
                    mesh.vertices.push(location.y + (vertex.y * circleRadius * 0.9));
                    mesh.vertices.push(location.z + (vertex.z * circleRadius * 0.9));

                    mesh.uv.push(uvs[(vertexIndex * 2)]);
                    mesh.uv.push(uvs[(vertexIndex * 2) + 1]);

                    vertexIndex++;
                });

                indices.forEach(function (index) {
                    mesh.indices.push(index + startIndex)
                });
            }

            combinedRadius += circleRadius * (ring > 0 ? 2 : 1);
        }

        this.scene.initialize();

        this.scene.camera.farPlane = 100.0;
    },

    render: function(canvas, timer) {
        canvas.renderToColorBuffer();

        Pyramid.gl.disable(Pyramid.gl.DEPTH_TEST);
        Pyramid.gl.enable(Pyramid.gl.BLEND);
        Pyramid.gl.blendFunc(Pyramid.gl.ONE, Pyramid.gl.ONE);

        Pyramid.gl.clearColor(0.2, 0.1, 0.0, 1);

        Pyramid.clear();

        var nrOfRings = this.nrOfRings;

        var timerSteps = 0.004;

        timer -= 8 * timerSteps;
        for (var frame = 0; frame < 16; frame++) {
            for (var i = 0; i < nrOfRings; i++) {
                this.scene.meshes[i].rotation = new Vector(0, 0, this.directions[i] * timer);
            }

            this.scene.camera.location = new Vector(Math.sin(timer * 0.5) * 10.0, Math.cos(timer * 0.3667) * 10.0, -35.0 + Math.sin(timer * 0.2) * 15.0);
            this.scene.camera.target = new Vector(Math.cos(timer * 0.3) * 4.0, Math.sin(timer * 0.424) * 4.0, 0.0);
            this.scene.camera.roll = timer * -0.02;

            this.scene.renderPass(0);

            timer += timerSteps;
        }

        Pyramid.resetFramebuffer();

        canvas.chromaticDistortion = new Vector(0.99, 0.98, 0.97);

        canvas.renderCombinator();
    }
});
