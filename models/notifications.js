module.exports = {
    getNotificationsByOwnerId: function (userId, start, length, attributes, result) {
        'use strict';

        var mongoose = require('mongoose');
        var notificationsSchema = getModelSchema('notifications');

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
                    return console.error(err);
                }

                result(res);
            });
    },
    newNotificationByOwnerId: function (ownerId, type, attributes, result) {
        'use strict';

        var mongoose = require('mongoose');
        var notificationsSchema = getModelSchema('notifications');
        var newNotification = new notificationsSchema({ 
            ownerId: mongoose.Types.ObjectId(ownerId),
            isRead: false,
            type: type,
            attributes: attributes
        });

        newNotification.save(function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    }
};
