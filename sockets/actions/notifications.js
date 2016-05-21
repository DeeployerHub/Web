module.exports = Notifications;

var Promise             = require('promise');
var socketsRepo         = getRepos('sockets')();
var notificationConfigs = getConfig('notifications');

/**
 * handle the socket.io's notifications actions
 *
 * @param io
 *
 * @returns {Notifications}
 * @constructor
 */
function Notifications(parent) {
    'use strict';

    if (!(this instanceof Notifications)) {
        return new Notifications(parent);
    }

    this.io     = parent.io;
    this.parent = parent;
}

/**
 * get audience's region
 *
 * @param type
 *
 * @returns {Promise}
 */
Notifications.prototype.getAudiencesRegion = function (type) {
    'use strict';

    return new Promise(function (resolve, reject) {
        if ('object' !== typeof notificationConfigs.socketRegion[type]) {
            reject(new Error('following type of notification does not found into system'));

            return;
        }

        resolve(notificationConfigs.socketRegion[type]);
    });
};

/**
 * broadcast the notification to the following audience
 *
 * @param ownerId
 * @param requestUserId
 * @param type
 * @param attributes
 *
 * @returns {Promise}
 */
Notifications.prototype.send = function (ownerId, requestUserId, type, attributes) {
    'use strict';

    var self = this;

    return new Promise(function (resolve, reject) {
        self.getAudiencesRegion(type).then(function (regions) {
            // get the list of sockets from db according to region
            socketsRepo.findSocketsIdByRegion(regions).then(function (sockets) {
                self.parent.broadcast(sockets, 'notification', {data: 'sdfsdfsf'}).then(function () {
                    resolve(true);
                }, reject);
            }, reject);
        }, reject);
    });
};
