function Effect() {
    this.resources = null;
    this.config = {
        resources: {
            textures: [],
            shaders: [],
            frameBuffers: [],
            vertexBuffers: []
        }
    };
}

Effect.prototype = {
    initialize: function() {
    },

    loadResources: function(finished) {
        this.resources = new Resources(this.config.resources);

        this.resources.initialize(function() {
            finished();
        });
    },

    allowResize: function() {
        return false;
    },

    render: function(canvas, timer) {
    }
};
