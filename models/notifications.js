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
            .skip(start)
            .limit(length)
            .exec(function (err, res) {
                if (err) {
                    return console.error(err);
                }

                result(res);
            });
    }
};
