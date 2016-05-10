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
 *
 * @returns {Promise}
 */
UserPosts.prototype.addNewPost = function (ownerUserId, content) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var newUserPost = new usersPostsSchema({
            ownerUserId: mongoose.Types.ObjectId(ownerUserId),
            content    : content
        });

        newUserPost.save(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res);
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
                        lastname : profileStack.lastname
                    };

                    obj.ownerUserId.profile = profileObj;
                });

                resolve(res);
            });
    });
};
