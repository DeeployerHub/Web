module.exports = UserRelations;

var Promise = require('promise');
var model   = getModel('usersRelations')();

/**
 * UserRelations Repository
 *
 * @returns {UserRelations}
 * @constructor
 */
function UserRelations () {
    'use strict';

    if (!(this instanceof UserRelations)) {
        return new UserRelations();
    }
}

/**
 * check if requested user has been followed
 *
 * @param requestUserId
 * @param responseUserId
 *
 * @returns {Promise}
 */
UserRelations.prototype.isFollowed = function (requestUserId, responseUserId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.isFollowed(requestUserId, responseUserId).then(resolve, reject);
    });
};

/**
 * follow the the response user
 *
 * @param requestUserId
 * @param responseUserId
 *
 * @returns {Promise}
 */
UserRelations.prototype.follow = function (requestUserId, responseUserId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.follow(requestUserId, responseUserId).then(resolve, reject);
    });
};

/**
 * unfollow the response user
 *
 * @param requestUserId
 * @param responseUserId
 *
 * @returns {Promise}
 */
UserRelations.prototype.unfollow = function (requestUserId, responseUserId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.unfollow(requestUserId, responseUserId).then(resolve, reject);
    });
};

/**
 * get followers list of response user
 *
 * @param responseUserId
 *
 * @returns {Promise}
 */
UserRelations.prototype.getUserFollowers = function (responseUserId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.getFollowersList(responseUserId).then(function (findRes) {
            var responseData = [];

            findRes.forEach(function (item) {
                var requestUserObject = item.requestUserId;

                var requestUserProfileObject = requestUserObject.profile;
                responseData.push({
                    _id: requestUserObject._id,
                    avatar: requestUserObject.avatar,
                    username: requestUserObject.username,
                    firstname: requestUserProfileObject.firstname,
                    lastname: requestUserProfileObject.lastname
                });
            });

            resolve(responseData);
        }, reject);
    });
};
