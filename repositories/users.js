module.exports = {
    isUsernameExists: function (username, callback) {
        'use strict';

        var model = getModel('users');

        model.findUserWithUsername(username, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        });
    },
    getUserInfo: function (email, callback) {
        'use strict';

        var model = getModel('users');

        model.findUserWithEmail(email, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        });
    },
    isUserRegistered: function (profile, email, callback) {
        'use strict';

        var model = getModel('users');

        model.findUserWithEmail(email, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                model.registerNewUser(email, function (registerRes) {
                    callback(registerRes, profile);
                });
            }
        });
    },
    isUserActivated: function (email, callback) {
        'use strict';

        var model = getModel('users');

        return model.findUserWithEmail(email, function (findRes) {
            return callback(findRes);
        });
    },
    updateAvatar: function (userId, avatarPath, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateUserAvatarById(userId, avatarPath, function (result) {
            return callback(result);
        });
    },
    updateUsername: function (userId, username, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateUsernameById(userId, username, function (result) {
            return callback(result);
        });
    }
};
