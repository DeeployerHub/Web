module.exports = Notifications;

var Promise = require('promise');
var mongoose = require('mongoose');
var notificationsSchema = getModelSchema('notifications');

/**
 *  Notifications Model
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
 * get the user's notification by ownerId
 *
 * @param userId
 * @param start
 * @param length
 * @param attributes
 *
 * @returns {Promise}
 */
Notifications.prototype.getNotificationsByOwnerId = function (userId, start, length, attributes) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var selectAttr = {};
        attributes.forEach(function (attr) {
            selectAttr[attr] = 1;
        });

        notificationsSchema
            .find({
                ownerId: mongoose.Types.ObjectId(userId)
            })
            .select(selectAttr)
            .sort({
                registerAt: -1
            })
            .skip(parseInt(start))
            .limit(parseInt(length))
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
 * add new notification for user by ownerId
 *
 * @param ownerId
 * @param type
 * @param attributes
 *
 * @returns {Promise}
 */
Notifications.prototype.newNotificationByOwnerId = function (ownerId, type, attributes) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var newNotification = new notificationsSchema({
            ownerId: mongoose.Types.ObjectId(ownerId),
            isRead: false,
            type: type,
            attributes: attributes
        });

        newNotification.save(function(err, res){
            if (err) {
                reject(err);

                return;
            }

            resolve(res[0]);
        });
    });
};
