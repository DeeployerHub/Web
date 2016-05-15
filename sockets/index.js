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

    // call the socket libs
    require('./connection')({
        io: io
    });
}
