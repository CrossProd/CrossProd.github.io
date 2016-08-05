function DlaGridItem() {
    this.taken = false;
    this.data = -1;
    this.generation = 0;
}

function DlaHelper(xSize, ySize, zSize) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.zSize = zSize;

    this.grid = [];

    this.takenPositions = [];

    this.takenPositionsPerData = [];

    this.init();
}

DlaHelper.prototype = {
    init: function() {
        for (var z = 0; z < this.zSize; z++) {
            this.grid[z] = [];

            for (var y = 0; y < this.ySize; y++) {
                this.grid[z][y] = [];

                for (var x = 0; x < this.xSize; x++) {
                    this.grid[z][y][x] = new DlaGridItem();
                }
            }
        }
    },

    // "clips" the position. returns true if in save area
    isValidPosition: function(x, y, z) {
        if (x <= 0 || x >= (this.xSize - 1)) return false;
        if (y <= 0 || y >= (this.ySize - 1)) return false;
        if (z <= 0 || z >= (this.zSize - 1)) return false;

        return true;
    },

    // get generation
    getGenerationAt: function(x, y, z, data) {
        if (this.grid[z - 1][y][x].data == data) return this.grid[z - 1][y][x].generation;
        if (this.grid[z + 1][y][x].data == data) return this.grid[z + 1][y][x].generation;
        if (this.grid[z][y - 1][x].data == data) return this.grid[z][y - 1][x].generation;
        if (this.grid[z][y + 1][x].data == data) return this.grid[z][y + 1][x].generation;
        if (this.grid[z][y][x - 1].data == data) return this.grid[z][y][x - 1].generation;
        if (this.grid[z][y][x + 1].data == data) return this.grid[z][y][x + 1].generation;

        return 0;
    },

    // returns a free random grid position

    getRandomPosition: function(data) {
        while (true) {
            var x = 1 + (Random.integer() % (this.xSize - 2));
            var y = 1 + (Random.integer() % (this.ySize - 2));
            var z = 1 + (Random.integer() % (this.zSize - 2));

            //alert(data);
            var randomToken = Random.integer() % this.takenPositionsPerData[data].length;

            x = this.takenPositionsPerData[data][randomToken].x + ((Random.integer() % 11) - 5);
            y = this.takenPositionsPerData[data][randomToken].y + ((Random.integer() % 11) - 5);
            z = this.takenPositionsPerData[data][randomToken].z + ((Random.integer() % 11) - 5);

            if (!this.isValidPosition(x, y, z)) {
                continue;
            }

            if (this.spaceAvailableAt(x, y, z, data)) return { x: x, y: y, z: z };
        }
    },

    shouldAttachAt: function(x, y, z, data) {
        if (this.grid[z][y][x].taken) {
            return false;
        }

        var startX = Math.max(x - 2, 0);
        var startY = Math.max(y - 2, 0);
        var startZ = Math.max(z - 2, 0);

        var endX = Math.min(x + 2, this.xSize - 1);
        var endY = Math.min(y + 2, this.ySize - 1);
        var endZ = Math.min(z + 2, this.zSize - 1);

        for (var xx = startX; xx <= endX; xx++)
        {
            for (var yy = startY; yy <= endY; yy++)
            {
                for (var zz = startZ; zz <= endZ; zz++)
                {
                    if (this.grid[zz][yy][xx].taken && (this.grid[zz][yy][xx].data != data)) return false;
                }
            }
        }

        if (this.grid[z - 1][y][x].data == data || this.grid[z + 1][y][x].data == data) return true;
        if (this.grid[z][y - 1][x].data == data || this.grid[z][y + 1][x].data == data) return true;
        if (this.grid[z][y][x - 1].data == data || this.grid[z][y][x + 1].data == data) return true;

        return false;
    },

    spaceAvailableAt: function(x, y, z, data) {
        if (this.grid[z][y][x].taken) {
            return false;
        }

        var startX = Math.max(x - 2, 0);
        var startY = Math.max(y - 2, 0);
        var startZ = Math.max(z - 2, 0);

        var endX = Math.min(x + 2, this.xSize - 1);
        var endY = Math.min(y + 2, this.ySize - 1);
        var endZ = Math.min(z + 2, this.zSize - 1);

        for (var xx = startX; xx <= endX; xx++) {
            for (var yy = startY; yy <= endY; yy++) {
                for (var zz = startZ; zz <= endZ; zz++) {
                    if (this.grid[zz][yy][xx].taken && (this.grid[zz][yy][xx].data != data)) return false;
                }
            }
        }

        return true;
    },

    addSeedAtPos: function(x, y, z, generation, data) {
        if (!this.spaceAvailableAt(x, y, z, data)) {
             return false;
        }

        this.grid[z][y][x].taken = true;
        this.grid[z][y][x].data = data;
        this.grid[z][y][x].generation = generation;

        this.takenPositions.push({
            x: x,
            y: y,
            z: z
        });

        if (!(data in this.takenPositionsPerData)) {
            this.takenPositionsPerData[data] = [];
        }

        this.takenPositionsPerData[data].push({
            x: x,
            y: y,
            z: z
        });

        return true;
    },

    addParticleAtRandomPos: function(data) {
        position = this.getRandomPosition(data);

        var x = position.x;
        var y = position.y;
        var z = position.z;

        while (true) {
            if (this.shouldAttachAt(x, y, z, data)) {
                generation = this.getGenerationAt(x, y, z, data) + 1;

                this.grid[z][y][x].taken = true;
                this.grid[z][y][x].data = data;
                this.grid[z][y][x].generation = generation;

                this.takenPositions.push({
                    x: x,
                    y: y,
                    z: z
                });

                this.takenPositionsPerData[data].push({
                    x: x,
                    y: y,
                    z: z
                });

                return;
            }
            else {
                switch (Random.integer() % 6) {
                    case 0: x--; break;
                    case 1: x++; break;
                    case 2: y--; break;
                    case 3: y++; break;
                    case 4: z--; break;
                    case 5: z++; break;
                }
            }

            if (!this.isValidPosition(x, y, z)) {
                position = this.getRandomPosition(data);

                x = position.x;
                y = position.y;
                z = position.z;
            }
        }
    }
};
