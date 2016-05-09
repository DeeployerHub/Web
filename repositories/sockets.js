module.exports = Sockets;

var Promise = require('promise');

/**
 * sockets repository
 * @returns {Sockets}
 * @constructor
 */
function Sockets() {
    'use strict';

    if (!(this instanceof Sockets)) {
        return new Sockets();
    }

    this.model = getModel('sockets')();
}

/**
 * when socket connects successfully
 */
Sockets.prototype.connect = function (userId, socketId) {
    'use strict';

    var base = this;
    return new Promise(function (resolve, reject) {
        base.model.addNewSocket(userId, socketId).then(resolve, reject);
    });
};

/**
 * when socket disconnects successfully
 */
Sockets.prototype.disconnect = function (socketId) {
    'use strict';

    var base = this;
    return new Promise(function (resolve, reject) {
        base.model.deleteSocket(socketId).then(resolve, reject);
    });
};
