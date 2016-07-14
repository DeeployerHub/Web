module.exports = Sockets;

var Promise = require('promise');
var model   = getModel('sockets')();

/**
 * Sockets Repository
 *
 * @returns {Sockets}
 * @constructor
 */
function Sockets () {
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
Sockets.prototype.connect = function (userId, socketId, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.addNewSocket(userId, socketId, region).then(resolve, reject);
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

/**
 * update the socket's currentGeoLocation
 *
 * @param socketId
 * @param position
 *
 * @returns {Promise}
 */
Sockets.prototype.refreshGeoLocation = function (socketId, position) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateSocketGeoLocation(socketId, position).then(resolve, reject);
    });
};

/**
 * update the socket's mapViewGeo
 *
 * @param socketId
 * @param center
 * @param corners
 *
 * @returns {Promise}
 */
Sockets.prototype.refreshMapViewGeo = function (socketId, center, corners) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateSocketMapViewGeo(socketId, center, corners).then(resolve, reject);
    });
};

/**
 * find socket ids by regions
 *
 * @param userId
 * @param region
 *
 * @returns {Promise}
 */
Sockets.prototype.findSocketsIdByRegionAndUser = function (userId, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findSocketsIdByRegionAndUser(
            userId,
            region.include || ['*'],
            region.exclude || []
        ).then(resolve, reject);
    });
};

/**
 * find socket ids that has common sight point
 *
 * @param corners
 * @param excludeSocketId
 *
 * @returns {Promise}
 */
Sockets.prototype.fetchSocketsInSight = function (corners, excludeSocketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findSocketsIdByRegionAndSightPoint(corners, excludeSocketId).then(resolve, reject);
    });
};

/**
 * find socket ids
 *
 * @param socketId
 * @param fields
 *
 * @returns {Promise}
 */
Sockets.prototype.fetchSocketsBySocketId = function (socketId, fields) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findSocketInfoBySocketId(socketId, fields).then(resolve, reject);
    });
};
