var Pyramid = {
    canvas: null,
    gl: null,
    extensions: {
        floatTexture: null,
        floatLinearTexture: null,
        halfFloatTexture: null,
        halfFloatLinearTexture: null
    },
    width: 0,
    height: 0,
    ratio: 1,

    init: function(canvas) {
        Pyramid.canvas = canvas;

        Pyramid.width = document.body.clientWidth;
        Pyramid.height = document.body.clientHeight;

        Pyramid.canvas.width = Pyramid.width;
        Pyramid.canvas.height = Pyramid.height;

        Pyramid.ratio = Pyramid.width / Pyramid.height;

        Pyramid.initializeWebGL();
    },

    resize: function() {
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;

        if (width == Pyramid.width && height == Pyramid.height) {
            return;
        }

        Pyramid.canvas.width = Pyramid.width = width;
        Pyramid.canvas.height = Pyramid.height = height;

        Pyramid.ratio = width / height;

        ResourcesBucket.resizeResources();
    },

    //
    // webgl init
    //

    initializeWebGL: function() {
        if (!window.WebGLRenderingContext) {
            return alert("Unable to initialize <a href=\"http://get.webgl.org\">WebGL</a>. Your browser may not support it.");
        }

        try {
            Pyramid.gl = Pyramid.canvas.getContext("webgl", {antialias:true});
        }
        catch(e) {
            try {
                Pyramid.gl = Pyramid.canvas.getContext("experimental-webgl");
            }
            catch(e) {
                return alert('Failed to create webGL context.');
            }
        }

        Pyramid.extensions.floatTexture = Pyramid.gl.getExtension('OES_texture_float');

        if (!Pyramid.extensions.floatTexture) {
            return alert("Could not load 'OES_texture_float' extension.");
        }

        Pyramid.extensions.floatLinearTexture = Pyramid.gl.getExtension('OES_texture_float_linear');

        if (!Pyramid.extensions.floatLinearTexture) {
            return alert("Could not load 'OES_texture_float_linear' extension.");
        }

        Pyramid.extensions.halfFloatTexture = Pyramid.gl.getExtension('OES_texture_half_float');
        Pyramid.extensions.halfFloatLinearTexture = Pyramid.gl.getExtension('OES_texture_half_float_linear');

        if (!Pyramid.extensions.halfFloatTexture) {
            return alert("Could not load 'OES_texture_half_float' extension.");
        }

        if (!Pyramid.extensions.halfFloatLinearTexture) {
            return alert("Could not load 'OES_texture_half_float_linear' extension.");
        }

        Pyramid.gl.HALF_FLOAT = 0x8D61;

        Pyramid.gl.enable(Pyramid.gl.DEPTH_TEST);

        Pyramid.gl.clearDepth(0);
        Pyramid.gl.depthFunc(Pyramid.gl.GEQUAL);

        Pyramid.gl.viewport(0, 0, Pyramid.width, Pyramid.height);
        Pyramid.gl.clearColor(0.0, 0.0, 0.0, 1);

        console.log("WebGL initialized and extensions loaded.");
    },

    //
    // frame buffer
    //

    clear: function() {
        Pyramid.gl.clear(Pyramid.gl.COLOR_BUFFER_BIT | Pyramid.gl.DEPTH_BUFFER_BIT);
    },

    setFramebuffer: function(frameBuffer) {
        Pyramid.gl.bindFramebuffer(Pyramid.gl.FRAMEBUFFER, frameBuffer);

        if (frameBuffer) {
            Pyramid.gl.viewport(0, 0, frameBuffer.width, frameBuffer.height);

            // switch (frameBuffer.textures.length)
            // {
            //     case 1:
            //         this.ext.drawBuffers.drawBuffersWEBGL([this.ext.drawBuffers.COLOR_ATTACHMENT0_WEBGL]);
            //         break;
            //     case 2:
            // this.ext.drawBuffers.drawBuffersWEBGL([this.ext.drawBuffers.COLOR_ATTACHMENT0_WEBGL, this.ext.drawBuffers.COLOR_ATTACHMENT1_WEBGL]);
            //         break;
            //     case 3:
            //         this.ext.drawBuffers.drawBuffersWEBGL([this.ext.drawBuffers.COLOR_ATTACHMENT0_WEBGL, this.ext.drawBuffers.COLOR_ATTACHMENT1_WEBGL, this.ext.drawBuffer.COLOR_ATTACHMENT2_WEBGL]);
            //         break;
            //     case 4:
            //         this.ext.drawBuffers.drawBuffersWEBGL([this.ext.drawBuffers.COLOR_ATTACHMENT0_WEBGL, this.ext.drawBuffers.COLOR_ATTACHMENT1_WEBGL, this.ext.drawBuffer.COLOR_ATTACHMENT2_WEBGL, this.ext.drawBuffers.COLOR_ATTACHMENT3_WEBGL]);
            //         break;
            // }

            // if (this.checkFramebufferStatus(gl.FRAMEBUFFER) !== this.FRAMEBUFFER_COMPLETE)
            // {
            //     console.error("Frame buffer failed");
            // }
        }
        else {
            Pyramid.gl.viewport(0, 0, Pyramid.width, Pyramid.height);
        }
    },

    resetFramebuffer: function() {
        Pyramid.gl.bindFramebuffer(Pyramid.gl.FRAMEBUFFER, null);

        Pyramid.gl.viewport(0, 0, Pyramid.width, Pyramid.height);
    },

    //
    // vertex buffer
    //

    createVertexBuffer: function(data) {
        var buffer = Pyramid.gl.createBuffer();

        Pyramid.gl.bindBuffer(Pyramid.gl.ARRAY_BUFFER, buffer);

        if (data) {
            Pyramid.gl.bufferData(Pyramid.gl.ARRAY_BUFFER, new Float32Array(data), Pyramid.gl.STATIC_DRAW);
        }

        return buffer;
    },

    setVertexBufferData: function(buffer, data) {
        Pyramid.gl.bindBuffer(Pyramid.gl.ARRAY_BUFFER, buffer);
        Pyramid.gl.bufferData(Pyramid.gl.ARRAY_BUFFER, new Float32Array(data), Pyramid.gl.STATIC_DRAW);
    },

    bindVertexBuffer: function(buffer) {
        Pyramid.gl.bindBuffer(Pyramid.gl.ARRAY_BUFFER, buffer);
    },

    //
    // index buffer
    //

    createIndexBuffer: function(data, elementSize) {
        var buffer = Pyramid.gl.createBuffer();

        Pyramid.gl.bindBuffer(Pyramid.gl.ELEMENT_ARRAY_BUFFER, buffer);

        if (data) {
            switch (elementSize) {
                case 16:
                    Pyramid.gl.bufferData(Pyramid.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), Pyramid.gl.STATIC_DRAW);
                    break;
                case 32:
                    Pyramid.gl.bufferData(Pyramid.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), Pyramid.gl.STATIC_DRAW);
                    break;
                default:
                    alert('Unknown elementSize for index buffer');
            }
        }

        return buffer;
    },

    bindIndexBuffer: function(buffer) {
        Pyramid.gl.bindBuffer(Pyramid.gl.ELEMENT_ARRAY_BUFFER, buffer);
    },

    //
    // texture
    //

    setTextureData: function(texture, data) {
        Pyramid.gl.bindTexture(gl.TEXTURE_2D, texture);

        Pyramid.gl.texImage2D(gl.TEXTURE_2D, 0, texture.internalFormat, texture.width, texture.height, 0, texture.internalFormat, texture.formatType, new Float32Array(data));

        Pyramid.gl.bindTexture(gl.TEXTURE_2D, null);
    },

    setTexture: function(texture, position, uniformLocation) {
        Pyramid.gl.activeTexture(Pyramid.gl.TEXTURE0 + position);
        Pyramid.gl.bindTexture(Pyramid.gl.TEXTURE_2D, texture);

        Pyramid.gl.uniform1i(uniformLocation, position);
    },

    //
    // vertex shader
    //

    compileVertexShader: function(script) {
        var shader = Pyramid.gl.createShader(Pyramid.gl.VERTEX_SHADER);

        Pyramid.gl.shaderSource(shader, script);
        Pyramid.gl.compileShader(shader);

        if (!Pyramid.gl.getShaderParameter(shader, Pyramid.gl.COMPILE_STATUS)) {
            alert(Pyramid.gl.getShaderInfoLog(shader));

            return null;
        }

        return shader;
    },

    //
    // fragment shader
    //

    compileFragmentShader: function(script) {
        var shader = Pyramid.gl.createShader(Pyramid.gl.FRAGMENT_SHADER);

        Pyramid.gl.shaderSource(shader, script);
        Pyramid.gl.compileShader(shader);

        if (!Pyramid.gl.getShaderParameter(shader, Pyramid.gl.COMPILE_STATUS)) {
            console.error(Pyramid.gl.getShaderInfoLog(shader));

            return null;
        }

        return shader;
    },

    //
    // shader program
    //

    createShaderProgram: function(vertexShader, fragmentShader) {
        var program = Pyramid.gl.createProgram();

        Pyramid.gl.attachShader(program, vertexShader);
        Pyramid.gl.attachShader(program, fragmentShader);

        Pyramid.gl.linkProgram(program);

        if (!Pyramid.gl.getProgramParameter(program, Pyramid.gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program.");

            return null;
        }

        Pyramid.gl.useProgram(program);

        return program;
    },

    useShaderProgram: function(program) {
        Pyramid.gl.useProgram(program);

        // set attributes
        for (var key in program.attributes) {
            var attribute = program.attributes[key];

            //alert(JSON.stringify(attribute));
            Pyramid.bindVertexBuffer(attribute.vertexBuffer);

            Pyramid.gl.vertexAttribPointer(attribute.location, attribute.size, attribute.elementType, false, 0, 0);
            Pyramid.gl.enableVertexAttribArray(attribute.location);
        }

//        Pyramid.gl.uniform1i(this.carbonCopySP.uniforms['uTexture'].location, 0);

        // set uniforms
        for (var key in program.uniforms) {
            var uniform = program.uniforms[key];

            //console.log(key);
            if (uniform.value) {
                switch (uniform.value.length) {
                    case 1:
                        Pyramid.gl.uniform1f(uniform.location, uniform.value[0]);
                        break;
                    case 2:
                        Pyramid.gl.uniform2f(uniform.location, uniform.value[0], uniform.value[1]);
                        break;
                    case 3:
                        Pyramid.gl.uniform3f(uniform.location, uniform.value[0], uniform.value[1], uniform.value[2]);
                        break;
                    case 4:
                        Pyramid.gl.uniform4f(uniform.location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
                        break;
                    case 16:
                        Pyramid.gl.uniformMatrix4fv(uniform.location, false, new Float32Array(uniform.value));
                        break;
                    default:
                        console.log('Unknown uniform value size for uniform: ' + key);
                        break;
                }
            }
        }

        // set textures
    }

};
