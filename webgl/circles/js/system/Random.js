var Random = {
    seed: 1234567,

    tab1: [],
    tab2: [],
    tab3: [],
    tab4: [],

    reset: function(seed) {
        if (arguments.length == 0) {
            seed = 1234567;
        }

        Random.seed = seed;
    },

    integer: function() {
        var hi = 16807 * (Random.seed >> 16);
        var lo = 16807 * (Random.seed & 0xFFFF);

        lo += (hi & 0x7FFF) << 16;
        lo += hi >> 15;

        if (lo > 2147483647) {
            lo -= 2147483647;
        }

        Random.seed = lo;

        return lo;
    },

    float: function() {
        return Random.integer() / 2147483647.0;
    },

    vectorOnCube: function(radius) {
        switch (Random.getInteger() % 6)
        {
            case 0:
                return new Vector( radius, -radius + (Random.float() * radius * 2.0), -radius + (Random.float() * radius * 2.0));
            case 1:
                return new Vector(-radius, -radius + (Random.float() * radius * 2.0), -radius + (Random.float() * radius * 2.0));
            case 2:
                return new Vector(-radius + (Random.float() * radius * 2.0), radius, -radius + (Random.float() * radius * 2.0));
            case 3:
                return new Vector(-radius + (Random.float() * radius * 2.0),-radius, -radius + (Random.float() * radius * 2.0));
            case 4:
                return new Vector(-radius + (Random.float() * radius * 2.0), -radius + (Random.float() * radius * 2.0),  radius);
            default:
                return new Vector(-radius + (Random.float() * radius * 2.0), -radius + (Random.float() * radius * 2.0), -radius);
        }
    },

    vectorInCube: function(radius) {
        return new Vector(-radius + (Random.float() * radius * 2.0),
            -radius + (Random.float() * radius * 2.0),
            -radius + (Random.float() * radius * 2.0));
    },

    vectorInBox: function(radius) {
        return new Vector(-radius.x + (Random.float() * radius.x * 2.0),
            -radius.y + (Random.float() * radius.y * 2.0),
            -radius.z + (Random.float() * radius.z * 2.0));
    },

    vectorOnPlane: function(radius) {
        return new Vector(-radius + (Random.float() * radius * 2.0),
            0,
            -radius + (Random.float() * radius * 2.0));
    },

    vectorOnSphere: function(radius) {
        // von neumann

        while (true)
        {
            var r1 = Random.float();
            var r2 = Random.float();
            var r3 = Random.float();

            var z1 = 1.0 - (2.0 * r1);
            var z2 = 1.0 - (2.0 * r2);
            var z3 = 1.0 - (2.0 * r3);

            var distancePower2 = (z1 * z1) + (z2 * z2) + (z3 * z3);

            if (distancePower2 < 1.0)
            {
                distancePower2 = Math.sqrt(distancePower2);

                return new Vector(z1 / distancePower2, z2 / distancePower2, z3 / distancePower2) * radius;
            }
        }
    },

    vectorInSphere: function(radius) {
        radius = radius * Random.float();

        return Random.vectorOnSphere(radius);
    }
};
