module.exports = {
    findUserWithUsername: function(username, result) {
        'use strict';

        var usersSchema = getModelSchema('users');

        usersSchema.find({ username: username }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    findUserWithEmail: function(userEmail, result) {
        'use strict';

        var usersSchema = getModelSchema('users');

        usersSchema.find({ email: userEmail }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    findUserWithId: function(userId, result) {
        'use strict';

        var mongoose = require('mongoose');
        var usersSchema = getModelSchema('users');

        usersSchema.find({
            _id: mongoose.Types.ObjectId(userId)
        }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    registerNewUser: function(email, result) {
        'use strict';

        var usersSchema = getModelSchema('users');
        var newUser = new usersSchema({ 
            email: email
        });

        newUser.save(function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res);
        });
    },
    updateUserAvatarById: function(userId, avatarPath, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            { 
                $set: {
                    avatar: avatarPath
                }
            },
            function (err, resObj) {
                if (err) {
                    return console.error(err);
                }

                result();
            }
        );
    },
    updateUserCoverById: function(userId, coverPath, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            { 
                $set: {
                    coverPicture: coverPath
                }
            },
            function (err, resObj) {
                if (err) {
                    return console.error(err);
                }

                result();
            }
        );
    },
    updateUsernameById: function(userId, username, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            { 
                $set: {
                    username: username.toLowerCase()
                }
            },
            function (err, resObj) {
                if (err) {
                    return console.error(err);
                }

                result();
            }
        );
    },
    updateProfileById: function(userId, profile, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

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
            function (err, resObj) {
                if (err) {
                    return console.error(err);
                }

                result();
            }
        );
    },
    updateActivationById: function(userId, value, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            { 
                $set: {
                    activated: value
                }
            },
            function (err, resObj) {
                if (err) {
                    return console.error(err);
                }

                result();
            }
        );
    },
    increasePoints: function(userId, increasePointsValue, attributes, result) {
        'use strict';

        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.find({
            _id: mongoose.Types.ObjectId(userId)
        }, function(err, res){
            if (err) {
                return console.error(err);
            }

            var pointBeforeAction = res[0].points || 0;
            var pointAfterAction = pointBeforeAction + increasePointsValue;

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
                        return console.error(err);
                    }

                    result(pointAfterAction);
                }
            );
        });
    }
};
