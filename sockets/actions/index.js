module.exports = Actions;

/**
 * sockets module actions
 * 
 * @returns {Actions}
 * @constructor
 */
function Actions(io) {
    'use strict';

    if (!(this instanceof Actions)) {
        return new Actions(io);
    }

    this.io = io;
}

/**
 * initialize the actions
 * @param action
 * @returns {*}
 */
Actions.prototype.init = function (action) {
    'use strict';

    return require('./' + action)(this.io);
};
