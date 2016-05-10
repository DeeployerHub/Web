module.exports = Sockets;

var Promise = require('promise');
var model = getModel('sockets')();

/**
 * Sockets Repository
 *
 * @returns {Sockets}
 * @constructor
 */
function Sockets() {
    'use strict';

    if (!(this instanceof Sockets)) {
        return new Sockets();
    }
}

/**
 * when socket connects successfully
 *
 * @param userId
 * @param socketId
 *
 * @returns {Promise}
 */
Sockets.prototype.connect = function (userId, socketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.addNewSocket(userId, socketId).then(resolve, reject);
    });
};

/**
 * when socket disconnects successfully
 *
 * @param socketId
 *
 * @returns {Promise}
 */
Sockets.prototype.disconnect = function (socketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.deleteSocket(socketId).then(resolve, reject);
    });
};
