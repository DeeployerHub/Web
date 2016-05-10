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
Sockets.prototype.addNewSocket = function (userId, socketId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        var newSocket = new socketsSchema({
            userId: mongoose.Types.ObjectId(userId),
            socketId: socketId,
            pid: process.pid
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
