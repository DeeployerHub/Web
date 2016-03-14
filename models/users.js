module.exports = {
    findUserWithUsername: function(username, result) {
        var usersSchema = getModelSchema('users');

        usersSchema.find({ username: username }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    findUserWithEmail: function(userEmail, result) {
        var usersSchema = getModelSchema('users');

        usersSchema.find({ email: userEmail }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    registerNewUser: function(email, result) {
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
        var mongoose = require('mongoose');

        var usersSchema = getModelSchema('users');

        usersSchema.findByIdAndUpdate(
            mongoose.Types.ObjectId(userId),
            { 
                $set: {
                    username: username
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
