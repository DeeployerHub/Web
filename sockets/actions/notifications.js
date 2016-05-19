var Promise = require('promise');

var notificationConfigs = getConfig('notifications');

module.exports = Notifications;
/**
 * handle the socket.io's notifications actions
 *
 * @param io
 *
 * @returns {Notifications}
 * @constructor
 */
function Notifications(io) {
    'use strict';

    if (!(this instanceof Notifications)) {
        return new Notifications(io);
    }

    this.io = io;
}

/**
 * get audience's region
 *
 * @param type
 * @returns {*}
 */
Notifications.prototype.getAudiencesRegion = function (type) {
    'use strict';

    if ('object' !== typeof notificationConfigs.socketRegion[type]) {
        throw new Error('following type of notification does not found into system');
    }

    return notificationConfigs.socketRegion[type];
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
        var region;
        try {
            region = self.getAudiencesRegion(type);
        } catch (e) {
            reject(e);

            return;
        }

        resolve(true);
    });
};
