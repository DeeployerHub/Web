module.exports = Sockets;

var Promise       = require('promise');
var mongoose      = require('mongoose');
var socketsSchema = getModelSchema('sockets');
var arrayLib      = getLib('array')();

/**
 *  Sockets Model
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
        reject  = reject || function () {};

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
 * update socket geo locaiton
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
 * update map view geo socket from db
 *
 * @param socketId
 * @param center
 * @param corners
 *
 * @returns {Promise}
 */
Sockets.prototype.updateSocketMapViewGeo = function (socketId, center, corners) {
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

            if (!corners) {
                reject(new Error('North East or North West are undefined'));

                return;
            }
            
            socketObj.mapViewCenter = center ? [center.latitude, center.longitude] : undefined;
            socketObj.mapViewBorder = corners ? {
                northEast: [corners.northEast.latitude, corners.northEast.longitude],
                southWest: [corners.southWest.latitude, corners.southWest.longitude]
            } : undefined;

            resolve(socketObj.save());
        });
    });
};

/**
 * find socket id by region and userid
 *
 * @param userId
 * @param include
 * @param exclude
 *
 * @returns {Promise}
 */
Sockets.prototype.findSocketsIdByRegionAndUser = function (userId, include, exclude) {
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
            query.$in = include;
        }
        query.$nin = exclude;

        socketsSchema
            .aggregate({
                $match: {
                    userId: {
                        $eq: mongoose.Types.ObjectId(userId)
                    },
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

/**
 * find socket id by region and sight point
 *
 * @param corners
 * @param excludeSocketId
 *
 * @returns {Promise}
 */
Sockets.prototype.findSocketsIdByRegionAndSightPoint = function (corners, excludeSocketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        if ('string' !== typeof excludeSocketId) {
            reject(new Error('config for exclude region must be an object'));

            return;
        }

        if (!corners) {
            reject(new Error('North East or North West are undefined'));

            return;
        }

        var mapCorners = {
            northEast: [corners.northEast.latitude, corners.northEast.longitude],
            southWest: [corners.southWest.latitude, corners.southWest.longitude]
        };

        var box = [
            mapCorners.southWest, mapCorners.northEast
        ];

        socketsSchema
            .find({
                region: {
                    $in: ['console']
                },
                socketId: {
                    $nin: [excludeSocketId]
                },
                mapViewCenter: {
                    $within: {
                        $box: box
                    }
                }
            })
            .select({
                userId: 1,
                socketId: 1,
                mapViewCenter: 1,
                mapViewBorder: 1,
                connectedAt: 1
            })
            .populate('userId', '_id avatar username profile')
            .exec(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res);
            });
    });
};

/**
 * get the socket info by socket id
 *
 * @param socketId
 * @param fields
 *
 * @returns {Promise}
 */
Sockets.prototype.findSocketInfoBySocketId = function (socketId, fields) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        fields = fields || {
                userId: 1,
                socketId: 1,
                mapViewCenter: 1,
                mapViewBorder: 1,
                connectedAt: 1
            };

        var query = socketsSchema.find({
            socketId: {
                $eq: socketId
            }
        }).select();

        if (fields.userId === 1) {
            query.populate('userId', '_id avatar username profile');
        }

        query.exec(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res);
        });
    });
};

/**
 * update/push into AudienceList
 *
 * @param socketId
 * @param inSightSockets
 *
 * @returns {Promise}
 */
Sockets.prototype.pushSocketsIntoAudienceList = function (socketId, inSightSockets) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        socketsSchema.findOne({
            socketId: socketId,
            region: 'console'
        }, function (err, socketObj) {
            if (err || !socketObj) {
                reject(err);

                return;
            }

            var tmpAudienceList = socketObj.audienceList || [];
            var stashAudienceList = arrayLib.unique(tmpAudienceList.concat(inSightSockets), socketId);
            socketObj.audienceList = stashAudienceList;

            socketObj.save();

            resolve(stashAudienceList);
        });
    });
};

/**
 * update/remove from AudienceList
 *
 * @param socketId
 * @param storedInsightSockets
 * @param sockets
 *
 * @returns {Promise}
 */
Sockets.prototype.removeSocketsFromAudienceList = function (socketId, storedInsightSockets, sockets) {
    'use strict';

    var base = this;

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        socketsSchema.findOne({
            socketId: socketId,
            region: 'console'
        }, function (err, socketObj) {
            if (err) {
                reject(err);

                return;
            }

            if (!storedInsightSockets) {
                storedInsightSockets = socketObj.audienceList;
            }

            // get the deference between the audience list and fetched socket
            var socketsDiff = arrayLib.diff(storedInsightSockets, sockets);

            // remove the deference from the list of the audience
            var substracted       = arrayLib.substract(storedInsightSockets, socketsDiff);
            var stashAudienceList = arrayLib.unique(substracted, socketId);

            socketObj.audienceList = sockets;

            socketObj.save();

            base.transformSocketId(socketsDiff).then(function (socketsDiffObj) {
                resolve({
                    audienceList: stashAudienceList,
                    socketsDiffObj: socketsDiffObj
                });
            }, reject);
        });
    });
};

/**
 * update/remove extra from AudienceList
 *
 * @param socketId
 * @param sockets
 *
 * @returns {Promise}
 */
Sockets.prototype.removeSocketsFromAudienceListExtra = function (socketId, sockets) {
    'use strict';

    var base = this;

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        socketsSchema.findOne({
            socketId: socketId,
            region: 'console'
        }, function (err, socketObj) {
            if (err) {
                reject(err);

                return;
            }

            var storedInsightSockets = socketObj.audienceList;
            // remove the deference from the list of the audience
            var listWithoutSockets = arrayLib.substract(storedInsightSockets, sockets);

            socketObj.audienceList = listWithoutSockets;

            socketObj.save();

            resolve();
        });
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
        reject = reject || function () {};

        socketLists = socketLists || [];

        socketsSchema
            .find({
                socketId: {
                    $in: socketLists
                },
            })
            .select({
                userId: 1,
                socketId: 1,
                mapViewCenter: 1,
                mapViewBorder: 1,
                connectedAt: 1
            })
            .populate('userId', '_id avatar username profile')
            .exec(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res);
            });
    });
};
