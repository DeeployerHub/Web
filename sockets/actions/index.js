var base = module.exports = Actions;

/**
 * sockets module actions
 * 
 * @returns {Actions}
 * @constructor
 */
function Actions(io) {
    'use strict';

    if (!(this instanceof Actions)) {
        return new Actions();
    }

    this.io = io;
}

Actions.prototype.init = function (action) {
    return require('./' + action)(base.io);
};
