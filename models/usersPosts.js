module.exports = {
    addNewPost: function (ownerUserId, content, result) {
        'use strict';

        var mongoose = require('mongoose');
        var usersPostsSchema = getModelSchema('usersPosts');

        var newUserPost = new usersPostsSchema({
            ownerUserId: mongoose.Types.ObjectId(ownerUserId),
            content: content
        });

        newUserPost.save(function (err, res) {
            if (err) {
                return console.error(err);
            }

            result(res);
        });
    },

    getPostsByOwnerId: function (userId, start, length, result) {
        'use strict';

        var mongoose = require('mongoose');
        var notificationsSchema = getModelSchema('usersPosts');

        notificationsSchema
            .find({
                ownerUserId: mongoose.Types.ObjectId(userId)
            })

            .populate('ownerUserId', '_id avatar username profile')
            .sort({
                postedAt: -1
            })
            .skip(parseInt(start))
            .limit(parseInt(length))
            .exec(function (err, res) {
                if (err) {
                    return console.error(err);
                }

                res.forEach(function (obj) {
                    var profileStack = obj.ownerUserId.profile.pop();
                    var profileObj = {
                        firstname: profileStack.firstname,
                        lastname: profileStack.lastname
                    };

                    obj.ownerUserId.profile = profileObj;
                });

                result(res);
            });
    }
};
