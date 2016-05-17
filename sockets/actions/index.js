var actions = module.exports = Actions;

/**
 * sockets module actions
 * 
 * @returns {Actions}
 * @constructor
 */
function Actions() {
    'use strict';

    if (!(this instanceof Actions)) {
        return new Actions();
    }

    // call the socket libs
    require('./notifications')({
        io: io
    });
}
