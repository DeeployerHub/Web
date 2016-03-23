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

            result(res[0]);
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
                $set: {
                    profile: [{
                        gender: profile.gender,
                        firstname: profile.firstname.toLowerCase(),
                        lastname: profile.lastname.toLowerCase(),
                        country: profile.country,
                        phone: profile.phone,
                        geoLocation: profile.geoLocation
                    }]
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
    }
};
