module.exports = Users;

var Promise = require('promise');
var model   = getModel('users')();

/**
 * Users Repository
 *
 * @returns {Users}
 * @constructor
 */
function Users () {
    'use strict';

    if (!(this instanceof Users)) {
        return new Users();
    }
}

/**
 * check if the username exists into system
 *
 * @param username
 *
 * @returns {Promise}
 */
Users.prototype.isUsernameExists = function (username) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserWithUsername(username).then(function (userData) {
            resolve(userData ? true : false);
        }, reject);
    });
};

/**
 * get the user's info by email
 *
 * @param email
 *
 * @returns {Promise}
 */
Users.prototype.getUserInfo = function (email) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserWithEmail(email).then(resolve, reject);
    });
};

/**
 * get the user's info by username
 *
 * @param username
 *
 * @returns {Promise}
 */
Users.prototype.getUserInfoByUsername = function (username) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserWithUsername(username).then(resolve, reject);
    });
};

/**
 * get the user's info by userId
 *
 * @param userId
 *
 * @returns {Promise}
 */
Users.prototype.getUserInfoById = function (userId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserWithId(userId).then(resolve, reject);
    });
};

/**
 * check if user is registered
 *      if not, register the user
 *
 * @param profile
 * @param email
 *
 * @returns {Promise}
 */
Users.prototype.isUserRegistered = function (profile, email) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.findUserWithEmail(email).then(function (findRes) {
            if (findRes) {
                resolve(findRes, profile);
            } else {
                model.registerNewUser(email).then(function (registerRes) {
                    resolve(registerRes, profile);
                }, function (err) {
                    reject(err);
                });
            }
        }, function () {
            model.registerNewUser(email).then(function (registerRes) {
                resolve(registerRes);
            }, function (err) {
                reject(err);
            });
        });
    });
};

/**
 * update the user's avatar
 *
 * @param userId
 * @param avatarPath
 *
 * @returns {Promise}
 */
Users.prototype.updateAvatar = function (userId, avatarPath) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateUserAvatarById(userId, avatarPath).then(resolve, reject);
    });
};

/**
 * update the user's cover
 *
 * @param userId
 * @param coverPath
 *
 * @returns {Promise}
 */
Users.prototype.updateCover = function (userId, coverPath) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateUserCoverById(userId, coverPath).then(resolve, reject);
    });
};

/**
 * update the user's username
 *
 * @param userId
 * @param username
 *
 * @returns {Promise}
 */
Users.prototype.updateUsername = function (userId, username) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateUsernameById(userId, username).then(resolve, reject);
    });
};

/**
 * update the user's profile
 *
 * @param userId
 * @param profile
 *
 * @returns {Promise}
 */
Users.prototype.updateProfile = function (userId, profile) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateProfileById(userId, profile).then(resolve, reject);
    });
};

/**
 * update the user's activation
 *
 * @param userId
 * @param value
 *
 * @returns {Promise}
 */
Users.prototype.updateActivation = function (userId, value) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.updateActivationById(userId, value).then(resolve, reject);
    });
};

/**
 * update the user's profile entities
 *
 * @param userId
 * @param oldProfileEntities
 * @param profileEntities
 *
 * @returns {Promise}
 */
Users.prototype.updateProfileEntities = function (userId, oldProfileEntities, profileEntities) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        for (var index in profileEntities) {
            if (index) {
                oldProfileEntities[index] = profileEntities[index];
            }
        }

        model.updateProfileById(userId, oldProfileEntities).then(resolve, reject);
    });
};
