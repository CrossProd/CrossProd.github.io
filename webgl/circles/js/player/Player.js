var Player = {
    effect: null,
    playing: false,
    canvas: null,
    startTimestamp: 0,

    init: function(effect, finished) {
        Player.effect = effect;

        Player.canvas = new Canvas();

        Player.canvas.initialize(function() {
            Player.effect.loadResources(function() {
                Player.effect.initialize();

                finished();
            });
        });
    },

    play: function() {
        Player.playing = true;

        Player.startTimestamp = getTimestamp();

        Player.performDrawCycle();
    },

    stop: function() {
        Player.playing = false;
    },

    performDrawCycle: function() {
        Pyramid.resize();

        var timer = (getTimestamp() - Player.startTimestamp) * 0.001;

        Player.effect.render(Player.canvas, timer);

        if (Player.playing) {
            requestAnimationFrame(Player.performDrawCycle.bind(this));
        }
    },
};
