module.exports = {
    getNotifications: function (userId, start, length, attributes, callback) {
        'use strict';

        var model = getModel('notifications');

        model.getNotificationsByOwnerId(userId, start, length, attributes, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        });
    }
};
