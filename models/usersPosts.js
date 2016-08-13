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
 * @param mapView
 * @param mapCenterView
 * @param region
 *
 * @returns {Promise}
 */
UserPosts.prototype.addNewPost = function (ownerUserId, content, position, mapView, mapCenterView, region) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var postedGeoLocation;
        if (position && position.latitude && position.longitude) {
            postedGeoLocation = [position.latitude, position.longitude];
        }

        var postedMapView = mapView ? {
            northEast: [mapView.northEast.latitude, mapView.northEast.longitude],
            southWest: [mapView.southWest.latitude, mapView.southWest.longitude]
        } : undefined;

        var postedMapViewCenter;
        if (mapCenterView && mapCenterView.latitude && mapCenterView.longitude) {
            postedMapViewCenter = [mapCenterView.latitude, mapCenterView.longitude];
        }

        var newUserPost = new usersPostsSchema({
            ownerUserId: mongoose.Types.ObjectId(ownerUserId),
            content: content,
            postedGeoLocation: postedGeoLocation,
            postedMapView: postedMapView || undefined,
            postedMapViewCenter: postedMapViewCenter,
            postedRegion: region || undefined
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
                        var profileStack = obj.ownerUserId.profile;
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
                    var profileStack = obj.ownerUserId.profile;
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

/**
 * TODO: FIX IT
 * get the posts of the user's by ownerId and map view
 *
 * @param userId
 * @param mapView
 * @param start
 * @param length
 *
 * @returns {Promise}
 */
UserPosts.prototype.getPostsByOwnerIdAndMapView = function (userIds, mapView, start, length) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        // prepare the users
        var users = [];
        userIds.forEach(function (userId) {
            users.push(mongoose.Types.ObjectId(typeof userId === 'object' ? userId._id : userId));
        });

        // prepare the corners
        var mapCorners = {
            northEast: [mapView.northEast.latitude, mapView.northEast.longitude],
            southWest: [mapView.southWest.latitude, mapView.southWest.longitude]
        };

        var box = [
            mapCorners.southWest, mapCorners.northEast
        ];
        
        usersPostsSchema
            .find({
                ownerUserId: {
                    $in: users
                },
                postedMapViewCenter: {
                    $within: {
                        $box: box
                    }
                }
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
                    var profileStack = obj.ownerUserId.profile;
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
