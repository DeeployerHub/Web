module.exports = UserRelations;

var Promise              = require('promise');
var mongoose             = require('mongoose');
var usersRelationsSchema = getModelSchema('usersRelations');

/**
 * UserRelations Model
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

        usersRelationsSchema
            .find({
                requestUserId: mongoose.Types.ObjectId(requestUserId),
                responseUserId: mongoose.Types.ObjectId(responseUserId)
            })
            .exec(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res.length > 0);
            });
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

        var model = getModel('usersRelations')();
        // check if user already followed or not
        model.isFollowed(requestUserId, responseUserId).then(function (followed) {
            if (!followed) {
                // insert the userRelation to DB
                var newUserRelation = new usersRelationsSchema({
                    requestUserId: mongoose.Types.ObjectId(requestUserId),
                    responseUserId: mongoose.Types.ObjectId(responseUserId)
                });

                newUserRelation.save(function (err, res) {
                    if (err) {
                        reject(err);

                        return;
                    }

                    resolve(typeof res === 'object');
                });
            } else {
                resolve(true);
            }
        }, reject);
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

        var model = getModel('usersRelations')();
        // check if user already followed or not
        model.isFollowed(requestUserId, responseUserId).then(function (followed) {
            if (followed) {
                // delete the userRelation
                usersRelationsSchema
                    .find({
                        requestUserId: mongoose.Types.ObjectId(requestUserId),
                        responseUserId: mongoose.Types.ObjectId(responseUserId)
                    })
                    .remove(function (err, res) {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(res.result.ok > 0);
                    })
                    .exec();
            } else {
                resolve(true);
            }
        }, reject);
    });
};

/**
 * get followers list of response user
 *
 * @param responseUserId
 *
 * @returns {Promise}
 */
UserRelations.prototype.getFollowersList = function (responseUserId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        usersRelationsSchema
            .find({
                responseUserId: mongoose.Types.ObjectId(responseUserId)
            })
            .sort({
                followedAt: -1
            })
            .populate('requestUserId', '_id avatar username profile')
            .exec(function (err, queryResult) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(queryResult);
            });
    });
};
