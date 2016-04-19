module.exports = {
    isFollowed: function (requestUserId, responseUserId, result) {
        'use strict';

        var mongoose             = require('mongoose');
        var usersRelationsSchema = getModelSchema('usersRelations');

        usersRelationsSchema
            .find({
                requestUserId : mongoose.Types.ObjectId(requestUserId),
                responseUserId: mongoose.Types.ObjectId(responseUserId)
            })
            .exec(function (err, res) {
                if (err) {
                    return console.error(err);
                }

                result(res.length > 0);
            });
    }
};
