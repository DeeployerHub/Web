module.exports = Notifications;

var Promise = require('promise');
var model = getModel('notifications')();

/**
 *  Notifications Repository
 *  
 * @returns {Notifications}
 * @constructor
 */
function Notifications() {
    'use strict';

    if (!(this instanceof Notifications)) {
        return new Notifications();
    }
}

/**
 * get the user's notifications from model
 *
 * @param userId
 * @param start
 * @param length
 * @param attributes
 *
 * @returns {Promise}
 */
Notifications.prototype.getNotifications = function (userId, start, length, attributes) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.getNotificationsByOwnerId(userId, start, length, attributes).then(resolve, reject);
    });
};

/**
 * send notification to specific user
 *
 * @param ownerId
 * @param type
 * @param attributes
 * @returns {Promise}
 */
Notifications.prototype.sendNotification = function (ownerId, type, attributes) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.newNotificationByOwnerId(ownerId, type, attributes).then(resolve, reject);
    });
};
