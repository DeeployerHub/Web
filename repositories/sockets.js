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
 * @param region
 *
 * @returns {Promise}
 */
Sockets.prototype.fetchSocketsInSight = function (corners, excludeSocketId, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findSocketsIdByRegionAndSightPoint(corners, excludeSocketId, region).then(resolve, reject);
    });
};

/**
 * find user ids that has common sight point
 *
 * @param corners
 * @param excludeSocketId
 * @param region
 *
 * @returns {Promise}
 */
Sockets.prototype.fetchUserIdFromSocketsInSight = function (corners, excludeSocketId, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserIdFromSocketsIdByRegionAndSightPoint(corners, excludeSocketId, region).then(resolve, reject);
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

/**
 * convert socket object to array of socketIds
 *
 * @param obj
 *
 * @returns {Promise}
 */
var prepareInsightData = function (obj) {
    'use strict';

    return new Promise(function (resolve, reject) {
        try {
            var result = [];

            if (!obj) {
                resolve(result);

                return;
            }

            if (typeof obj !== 'object') {
                reject(new Error('it has to be object'));

                return;
            }

            obj.forEach(function (innerObj) {
                if (typeof innerObj === 'string') {
                    result.push(innerObj);
                } else {
                    result.push(innerObj.socketId);
                }
            });

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * push sockets into socketAudienceList
 *
 * @param socketId
 * @param inSightSockets
 *
 * @returns {*}
 */
Sockets.prototype.pushSocketsIntoAudienceList = function (socketId, inSightSockets) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        prepareInsightData(inSightSockets).then(function (inSightSocketsProcessed) {
            model.pushSocketsIntoAudienceList(socketId, inSightSocketsProcessed).then(resolve, reject);
        }, reject);
    });
};

/**
 * remove sockets from socketAudienceList
 *
 * @param socketId
 * @param storedInsightSockets
 * @param sockets
 *
 * @returns {*}
 */
Sockets.prototype.removeSocketsFromAudienceList = function (socketId, storedInsightSockets, sockets) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        prepareInsightData(storedInsightSockets).then(function (storedInsightSocketsProcessed) {
            prepareInsightData(sockets).then(function (socketsProcessed) {
                model.removeSocketsFromAudienceList(socketId, storedInsightSocketsProcessed, socketsProcessed)
                     .then(resolve, reject);
            }, reject);
        }, reject);
    });
};

/**
 * remove sockets extra from socketAudienceList
 *
 * @param socketId
 * @param sockets
 */
Sockets.prototype.removeSocketsFromAudienceListExtra = function (socketId, sockets) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        prepareInsightData(sockets).then(function (socketsProcessed) {
            model.removeSocketsFromAudienceListExtra(socketId, socketsProcessed)
                 .then(resolve, reject);
        }, reject);
    });
};

/**
 * transform socketId into socket object
 *
 * @param socketLists
 *
 * @returns {Promise}
 */
Sockets.prototype.transformSocketId = function (socketLists) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.transformSocketId(socketLists).then(resolve, reject);
    });
};
