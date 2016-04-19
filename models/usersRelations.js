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
    },
    follow: function (requestUserId, responseUserId, result) {
        'use strict';

        var mongoose             = require('mongoose');
        var usersRelationsSchema = getModelSchema('usersRelations');

        var model = getModel('usersRelations');
        // check if user already followed or not
        model.isFollowed(requestUserId, responseUserId, function (followed) {
            if (!followed) {
                // insert the userRelation to DB

                var newUserRelation = new usersRelationsSchema({
                    requestUserId : mongoose.Types.ObjectId(requestUserId),
                    responseUserId: mongoose.Types.ObjectId(responseUserId)
                });

                newUserRelation.save(function(err, res){
                    if (err) {
                        return console.error(err);
                    }

                    result(typeof res === 'object');
                });
            } else {
                result(true);
            }
        });
    },
    unfollow: function (requestUserId, responseUserId, result) {
        'use strict';

        var mongoose             = require('mongoose');
        var usersRelationsSchema = getModelSchema('usersRelations');

        var model = getModel('usersRelations');
        // check if user already followed or not
        model.isFollowed(requestUserId, responseUserId, function (followed) {
            if (followed) {
                // delete the userRelation
                usersRelationsSchema
                    .find({
                        requestUserId : mongoose.Types.ObjectId(requestUserId),
                        responseUserId: mongoose.Types.ObjectId(responseUserId)
                    })
                    .remove(function(err, res){
                        if (err) {
                            return console.error(err);
                        }

                        result(res.result.ok > 0);
                    })
                    .exec();
            } else {
                result(true);
            }
        });
    }
};
