module.exports = Sockets;

var Promise = require('promise');
var mongoose = require('mongoose');

/**
 *  model for sockets
 * @returns {Sockets}
 * @constructor
 */
function Sockets() {
    'use strict';

    if (!(this instanceof Sockets)) {
        return new Sockets();
    }

    this.model = getModel('users');
    this.socketsSchema = getModelSchema('sockets');
}

/**
 * add new socket into db
 */
Sockets.prototype.addNewSocket = function (userId, socketId) {
    'use strict';

    var base = this;
    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        var newSocket = new base.socketsSchema({
            userId: mongoose.Types.ObjectId(userId),
            socketId: socketId
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
 */
Sockets.prototype.deleteSocket = function (socketId) {
    'use strict';


    var base = this;
    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject = reject || function () {};

        base.socketsSchema
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
