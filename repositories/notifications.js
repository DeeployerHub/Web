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
    },
    sendNotification: function (ownerId, type, attributes, callback) {
        'use strict';

        var model = getModel('notifications');

        model.newNotificationByOwnerId(ownerId, type, attributes, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        });
    }
};
