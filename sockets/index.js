module.exports = Sockets;

/**
 * sockets module
 * @param io
 * @returns {Sockets}
 * @constructor
 */
function Sockets(io) {
    'use strict';

    if (!(this instanceof Sockets)) {
        return new Sockets(io);
    }

    this.io = io;
}

/**
 * drive the routes into the system
 */
Sockets.prototype.drive = function () {
    'use strict';

    var base = {
        io: this.io
    };

    // call the socket libs
    require('./connection')(base);
};
