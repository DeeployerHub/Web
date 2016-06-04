module.exports = Users;

var Promise     = require('promise');
var mongoose    = require('mongoose');
var usersSchema = getModelSchema('users');

/**
 * Users Model
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
 * fetch the user's info by username
 *
 * @param username
 *
 * @returns {Promise}
 */
Users.prototype.findUserWithUsername = function (username) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.find({username: username}, function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res[0]);
        });
    });
};

/**
 * fetch the user's info by email
 *
 * @param userEmail
 *
 * @returns {Promise}
 */
Users.prototype.findUserWithEmail = function (userEmail) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.find({email: userEmail}, function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res[0]);
        });
    });
};

/**
 * fetch the user's info by id
 *
 * @param userId
 *
 * @returns {Promise}
 */
Users.prototype.findUserWithId = function (userId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.find({
            _id: mongoose.Types.ObjectId(userId)
        }, function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res[0]);
        });
    });
};

/**
 * register the user into db
 *
 * @param email
 *
 * @returns {Promise}
 */
Users.prototype.registerNewUser = function (email) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var newUser = new usersSchema({
            email: email
        });

        newUser.save(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res);
        });
    });
};

/**
 * update the user avatar by id
 *
 * @param userId
 * @param avatarPath
 *
 * @returns {Promise}
 */
Users.prototype.updateUserAvatarById = function (userId, avatarPath) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            {
                $set: {
                    avatar: avatarPath
                }
            },
            function (err, resObj) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            }
        );
    });
};

/**
 * update the user cover by id
 *
 * @param userId
 * @param coverPath
 *
 * @returns {Promise}
 */
Users.prototype.updateUserCoverById = function (userId, coverPath) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            {
                $set: {
                    coverPicture: coverPath
                }
            },
            function (err, resObj) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            }
        );
    });
};

/**
 * update username by id
 *
 * @param userId
 * @param username
 *
 * @returns {Promise}
 */
Users.prototype.updateUsernameById = function (userId, username) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            {
                $set: {
                    username: username.toLowerCase()
                }
            },
            function (err, resObj) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            }
        );
    });
};

/**
 * update profile by id
 *
 * @param userId
 * @param profile
 *
 * @returns {Promise}
 */
Users.prototype.updateProfileById = function (userId, profile) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            {
                $push: {
                    profile: {
                        gender: profile.gender,
                        firstname: profile.firstname.toLowerCase(),
                        lastname: profile.lastname.toLowerCase(),
                        country: profile.country,
                        phone: profile.phone,
                        geoLocation: profile.geoLocation
                    }
                }
            },
            function (err) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            }
        );
    });
};

/**
 * update activation by id
 *
 * @param userId
 * @param value
 *
 * @returns {Promise}
 */
Users.prototype.updateActivationById = function (userId, value) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            {
                $set: {
                    activated: value
                }
            },
            function (err) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            }
        );
    });
};

/**
 * increase the user points
 *
 * @param userId
 * @param increasePointsValue
 * @param attributes
 *
 * @returns {Promise}
 */
Users.prototype.increasePoints = function (userId, increasePointsValue, attributes) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersSchema.find({
            _id: mongoose.Types.ObjectId(userId)
        }, function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            var pointBeforeAction = res[0].points || 0;
            var pointAfterAction  = pointBeforeAction + increasePointsValue;

            var pointsHistory = {
                points: increasePointsValue,
                pointBeforeAction: pointBeforeAction,
                pointAfterAction: pointAfterAction,
                type: attributes.type,
                reason: attributes.reason,
                description: attributes.description
            };

            usersSchema.findByIdAndUpdate(
                mongoose.Types.ObjectId(userId),
                {
                    $set: {
                        points: pointAfterAction
                    },
                    $push: {
                        pointsHistory: pointsHistory
                    }
                },
                function (err) {
                    if (err) {
                        reject(err);

                        return;
                    }

                    resolve(pointAfterAction);
                }
            );
        });
    });
};
