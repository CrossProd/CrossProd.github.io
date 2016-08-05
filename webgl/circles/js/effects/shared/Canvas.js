function Canvas() {
    //this.guassianBlurSP = null;
    this.carbonCopySP = null;
    this.combinatorSP = null;
//    this.downScale4XSP = null;
    //this.downScale4XSP = null;

    this.colorBufferTexture = null;

    this.chromaticDistortion = new Vector(1, 1, 1);

    //PRShaderProgram *straightCopyShader;
    //PRShaderProgram *gaussianBlurShader;
    //PRShaderProgram *downScale4XShader;
    //PRShaderProgram *combineMixShader;
    //PRShaderProgram *combineAddShader;
    //PRShaderProgram *highPassShader;
    //PRShaderProgram *finalPassShader;

    this.config = {
        resources: {
            textures: {
                colorBuffer: {
                    type: 'color',
                    width: '*',
                    height: '*'
                }
            },
            framebuffers: {
                colorBuffer: {
                    width: '*',
                    height: '*',
                    textures: [
                        'colorBuffer'
                    ]
                }
            },
            shaders: {
                carbonCopy: {
                    vs: "js/effects/shared/shaders/simpleQuad.vert",
                    fs: "js/effects/shared/shaders/simpleQuad.frag",
                    attributes: {
                        aPosition: {
                            size: 2,
                            vertexBuffer: "fullScreenQuad"
                        }
                    },
                    uniforms: {
                        uTexture: { }
                    }
                },
                combinator: {
                    vs: "js/effects/shared/shaders/simpleQuad.vert",
                    fs: "js/effects/shared/shaders/combinator.frag",
                    attributes: {
                        aPosition: {
                            size: 2,
                            vertexBuffer: "fullScreenQuad"
                        }
                    },
                    uniforms: {
                        uColorTexture: { },
                        uChromaticDistortion: {
                            value: [
                                1, 1, 1
                            ]
                        }
                    }
                }
            },
            vertexBuffers: {
                "fullScreenQuad": {
                    "value": [
                        -1.0, -1.0,
                         1.0,  1.0,
                        -1.0,  1.0,
                        -1.0, -1.0,
                         1.0, -1.0,
                         1.0,  1.0
                    ]
                }
            }
        }
    }
}

Canvas.prototype = {
    initialize: function(finished) {
        this.loadResources(finished);
    },

    loadResources: function(finished) {
        this.resources = new Resources(this.config.resources);

        var canvas = this;

        this.resources.initialize(function() {
            canvas.carbonCopySP = canvas.resources.programs['carbonCopy'];

            canvas.carbonCopySP.attributes.aPosition.vertexBuffer = canvas.resources.vertexBuffers.fullScreenQuad;

            canvas.combinatorSP = canvas.resources.programs['combinator'];

            canvas.combinatorSP.attributes.aPosition.vertexBuffer = canvas.resources.vertexBuffers.fullScreenQuad;

            canvas.colorBufferTexture = canvas.resources.textures['colorBuffer'];

            finished();
        });
    },

    renderToColorBuffer: function() {
        Pyramid.setFramebuffer(this.resources.framebuffers['colorBuffer']);
    },

    renderCombinator: function() {
        Pyramid.gl.disable(Pyramid.gl.DEPTH_TEST);
        Pyramid.gl.disable(Pyramid.gl.BLEND);

        this.combinatorSP.uniforms.uChromaticDistortion.value = this.chromaticDistortion.toArray();

        Pyramid.useShaderProgram(this.combinatorSP);

        Pyramid.setTexture(this.colorBufferTexture, 0, this.combinatorSP.uniforms['uColorTexture'].location);

        Pyramid.gl.drawArrays(Pyramid.gl.TRIANGLES, 0, 6);
    }
};
