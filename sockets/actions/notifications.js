var Promise = require('promise');

var notificationConfigs = getConfig('notifications');

var base = module.exports = Notifications;
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
 *
 * @param type
 * @returns {Array}
 */
Notifications.prototype.getAudiencesRegion = function (type) {
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
    console.log('send', ownerId, requestUserId, type, attributes);

    return new Promise(function (resolve, reject) {

    });
};
