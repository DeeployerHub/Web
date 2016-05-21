module.exports = Sockets;

var Promise = require('promise');
var mongoose = require('mongoose');
var socketsSchema = getModelSchema('sockets');

/**
 *  Sockets Model
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
 * add new socket into db
 *
 * @param userId
 * @param socketId
 *
 * @returns {Promise}
 */
Sockets.prototype.addNewSocket = function (userId, socketId, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        var newSocket = new socketsSchema({
            userId: mongoose.Types.ObjectId(userId),
            socketId: socketId,
            pid: process.pid,
            region: region
        });

        newSocket.save(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res);
        });
    });
};

/**
 * delete socket from db
 *
 * @param socketId
 *
 * @returns {Promise}
 */
Sockets.prototype.deleteSocket = function (socketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        socketsSchema
            .find({
                socketId: socketId
            })
            .remove(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res.result.ok > 0);
            })
            .exec();
    });
};

/**
 * delete socket from db
 *
 * @param socketId
 *
 * @returns {Promise}
 */
Sockets.prototype.updateSocketGeoLocation = function (socketId, position) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        socketsSchema.findOne({
                socketId: socketId
        }, function (err, socketObj) {
            if (err) {
                reject(err);

                return;
            }

            socketObj.geoLocation = [position.latitude, position.longitude];

            resolve(socketObj.save());
        });
    });
};

/**
 * delete socket from db
 *
 * @param include
 * @param exclude
 *
 * @returns {Promise}
 */
Sockets.prototype.findSocketsIdByRegion = function (include, exclude) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        if ('object' !== typeof include) {
            reject(new Error('config for included region must be an object'));

            return;
        }
        include = include.length === 0 ? ['*'] : include;

        if ('object' !== typeof exclude) {
            reject(new Error('config for exclude region must be an object'));

            return;
        }

        var query = {};
        if (include.indexOf('*') === -1) {
            query['$in'] = include;
        }
        query['$nin'] = exclude;

        socketsSchema
            .aggregate({
                $match: {
                    region: query
                }
            })
            .group({
                _id: '$socketId'
            })
            .exec(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res);
            });
    });
};
