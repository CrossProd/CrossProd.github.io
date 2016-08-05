function Resources(config) {
    this.config = config;

    this.programs = [];
    this.textures = [];
    this.framebuffers = [];
    this.vertexBuffers = [];

    this.bust = "?bust=" + (new Date()).getTime();
}

Resources.prototype = {
    initialize: function(finished) {
        var that = this;

        this.loadTextures(this.config.textures);
        this.loadFramebuffers(this.config.framebuffers);
        this.loadVertexBuffers(this.config.vertexBuffers);

        that.loadShaderPrograms(this.config.shaders, function() {
            finished();
        });
    },

    loadTextures: function(textureConfig) {
        var gl = Pyramid.gl;

        for (var key in textureConfig) {
            var config = textureConfig[key];

            var texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, texture);

            texture.internalFormat = gl.RGBA;
            texture.formatType = gl.HALF_FLOAT;
            texture.width = config.width === '*' ? Pyramid.width : config.width;
            texture.height = config.height === '*' ? Pyramid.height : config.height;


            gl.texImage2D(gl.TEXTURE_2D, 0, texture.internalFormat, texture.width, texture.height, 0, texture.internalFormat, texture.formatType, null);

            switch (config.type) {
                case "compute": {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    break;
                }
                case "color": {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    break;
                }
                default: {
                    console.log("Unknown texture type for texture '" + key + "'");

                    break;
                }
            }

            gl.bindTexture(gl.TEXTURE_2D, null);

            this.textures[key] = texture;

            console.log("Texture created: " + key + ". Dimensions: " + texture.width + " x " + texture.height);
        }
    },

    loadFramebuffers: function(framebuffersConfig) {
        var gl = Pyramid.gl;

        for (var key in framebuffersConfig) {
            var config = framebuffersConfig[key];

            var frameBuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

            frameBuffer.textures = [];

            for (var i = 0; i < config.textures.length; i++) {
                var textureKey = config.textures[i];

                var texture = this.textures[textureKey];

                frameBuffer.textures[i] = texture;

                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0);
            }

            if (!gl.isFramebuffer(frameBuffer)) {
                console.error("Frame buffer failed");
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            frameBuffer.width = config.width === '*' ? Pyramid.width : config.width;
            frameBuffer.height =  config.width === '*' ? Pyramid.height : config.height;

            this.framebuffers[key] = frameBuffer;

            console.log("Framebuffer created: " + key + ". Dimensions: " + frameBuffer.width + " x " + frameBuffer.height);
        }
    },

    loadShaderPrograms: function(shaderConfig, finished) {
        var that = this;

        var shaderCount = Object.keys(shaderConfig).length;

        for (var key in shaderConfig) {
            var config = shaderConfig[key];

            this.loadShaderProgram(config, key, function() {
                shaderCount--;

                if (shaderCount == 0) {
                    finished();
                }
            });
        }
    },

    loadShaderProgram: function(shaderConfig, key, finished) {
        var that = this;

        that.loadVertexShader(shaderConfig.vs + that.bust, function(vertexShader) {
            that.loadFragmentShader(shaderConfig.fs + that.bust, function(fragmentShader) {
                console.log("Loading shader program '" + key + "'");

                var program = Pyramid.createShaderProgram(vertexShader, fragmentShader);

                that.configUniformsForProgram(program, shaderConfig);
                that.configAttributesForProgram(program, shaderConfig);

                that.programs[key] = program;

                finished()
            });
        });
    },

    loadVertexShader: function(filename, finished) {
        $.get(filename, function(data) {
            console.log('Compiling vertex shader: ' + filename);

            finished(Pyramid.compileVertexShader(data));
        });
    },

    loadFragmentShader: function(filename, finished) {
        $.get(filename, function(data) {
            console.log('Compiling fragment shader: ' + filename);

            finished(Pyramid.compileFragmentShader(data));
        });
    },

    loadVertexBuffers: function(vertexBuffersConfig) {
        for (var key in vertexBuffersConfig) {
            var config = vertexBuffersConfig[key];

            console.log("Loading vertex buffer: " + key);

            var buffer = Pyramid.createVertexBuffer(config.value);

            this.vertexBuffers[key] = buffer;
        }
    },

    configUniformsForProgram: function(program, shaderConfig) {
        program.uniforms = [];

        for (var key in shaderConfig.uniforms) {
            var config = shaderConfig.uniforms[key];

            var location = Pyramid.gl.getUniformLocation(program, key);

            program.uniforms[key] = { 'location' : location };

            program.uniforms[key].value = config.value;
            program.uniforms[key].defaultValue = config.value;
        }
    },

    configAttributesForProgram: function(program, shaderConfig) {
        program.attributes = [];

        for (var key in shaderConfig.attributes) {
            var config = shaderConfig.attributes[key];

            var location = Pyramid.gl.getAttribLocation(program, key);

            program.attributes[key] = {
                location : location,
                elementType : Pyramid.gl.FLOAT,
                size : config.size,
                vertexBufferKey: config.vertexBuffer,
                vertexBuffer: null
            };
        }

    }
};