module.exports = Notifications;

var Promise      = require('promise');
var model        = getModel('notifications')();
var socketAction = getSocketActions(io);

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
Notifications.prototype.sendNotification = function (ownerId, requestUserId, type, attributes) {
    'use strict';

    var socketNotifyActions = socketAction.init('notifications');


    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        socketNotifyActions.send(ownerId, requestUserId, type, attributes).then(function () {
            model.newNotificationByOwnerId(ownerId, requestUserId, type, attributes).then(resolve, reject);
        }, reject);
    });
};
