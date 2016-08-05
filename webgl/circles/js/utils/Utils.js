Object.extend = function(object, newObjectDefinition) {
    newObject = Object.create(object);

    for (var key in newObjectDefinition) {
        newObject[key] = newObjectDefinition[key];
    }

    return newObject;
};

if (window.performance.now) {
    console.log("Using high performance timer");

    getTimestamp = function() { return window.performance.now(); };
}
else {
    if (window.performance.webkitNow) {
        console.log("Using webkit high performance timer");

        getTimestamp = function() { return window.performance.webkitNow(); };
    }
    else {
        console.log("Using low performance timer");

        getTimestamp = function() { return new Date().getTime(); };
    }
}

Colors = {
    hexToVector: function (hex) {
        return new Vector(parseInt(hex.substr(0, 2), 16) / 255.0,
            parseInt(hex.substr(2, 2), 16) / 255.0,
            parseInt(hex.substr(4, 2), 16) / 255.0);
    }
};
