module.exports = UserPosts;

var Promise          = require('promise');
var mongoose         = require('mongoose');
var usersPostsSchema = getModelSchema('usersPosts');

/**
 * UserPosts Model
 *
 * @returns {UserPosts}
 * @constructor
 */
function UserPosts () {
    'use strict';

    if (!(this instanceof UserPosts)) {
        return new UserPosts();
    }
}

/**
 * add new post into database
 *
 * @param ownerUserId
 * @param content
 * @param position
 *
 * @returns {Promise}
 */
UserPosts.prototype.addNewPost = function (ownerUserId, content, position) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var postedGeoLocation = null;
        if (position.latitude && position.longitude) {
            postedGeoLocation = [position.latitude, position.longitude];
        }

        var newUserPost = new usersPostsSchema({
            ownerUserId: mongoose.Types.ObjectId(ownerUserId),
            content: content,
            postedGeoLocation: postedGeoLocation || undefined
        });

        newUserPost.save(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            // fetch the correct info for the added post
            usersPostsSchema
                .find({
                    _id: mongoose.Types.ObjectId(res._id)
                })

                .populate('ownerUserId', '_id avatar username profile')
                .exec(function (errPost, resPost) {
                    if (errPost) {
                        reject(errPost);

                        return;
                    }

                    resPost.forEach(function (obj) {
                        var profileStack = obj.ownerUserId.profile.pop();
                        var profileObj   = {
                            firstname: profileStack.firstname,
                            lastname: profileStack.lastname
                        };

                        obj.ownerUserId.profile = profileObj;
                    });

                    resolve(resPost);
                });
        });
    });
};

/**
 * get the posts of the user's by ownerId
 *
 * @param userId
 * @param start
 * @param length
 *
 * @returns {Promise}
 */
UserPosts.prototype.getPostsByOwnerId = function (userId, start, length) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersPostsSchema
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
                    reject(err);

                    return;
                }

                res.forEach(function (obj) {
                    var profileStack = obj.ownerUserId.profile.pop();
                    var profileObj   = {
                        firstname: profileStack.firstname,
                        lastname: profileStack.lastname
                    };

                    obj.ownerUserId.profile = profileObj;
                });

                resolve(res);
            });
    });
};
