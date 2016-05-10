module.exports = UserPosts;

var Promise = require('promise');
var model = getModel('usersPosts')();

/**
 * UserPosts Repository
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
 * add new post
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

        model.addNewPost(ownerUserId, content).then(resolve, reject);
    });
};

/**
 * get the profile's posts from model
 *
 * @param userId
 * @param start
 * @param length
 *
 * @returns {Promise}
 */
UserPosts.prototype.getProfilePosts = function (userId, start, length) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.getPostsByOwnerId(userId, start, length).then(resolve, reject);
    });
};
