module.exports = Locations;

/**
 * handle the socket.io's Locations actions
 *
 * @param parent
 *
 * @returns {Locations}
 * @constructor
 */
function Locations (parent) {
    'use strict';

    if (!(this instanceof Locations)) {
        return new Locations(parent);
    }

    this.io     = parent.io;
    this.parent = parent;
}
