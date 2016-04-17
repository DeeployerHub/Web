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
    updateCover: function (userId, coverPath, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateUserCoverById(userId, coverPath, function (result) {
            return callback(result);
        });
    },
    updateUsername: function (userId, username, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateUsernameById(userId, username, function (result) {
            return callback(result);
        });
    },
    updateProfile: function (userId, profile, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateProfileById(userId, profile, function (result) {
            return callback(result);
        });
    },
    updateActivation: function (userId, value, callback) {
        'use strict';

        var model = getModel('users');

        return model.updateActivationById(userId, value, function (result) {
            return callback(result);
        });
    },
    earnPoint: function (userId, value, attributes, callback) {
        'use strict';

        var model = getModel('users');

        return model.increasePoints(userId, value, attributes, function (result) {
            return callback(result);
        });
    },
    updateProfileEntities: function (userId, oldProfileEntities, profileEntities, callback) {
        'use strict';

        var model = getModel('users');

        oldProfileEntities = oldProfileEntities.pop();

        for (var index in profileEntities) {
            if (index) {
                oldProfileEntities[index] = profileEntities[index];
            }
        }

        return model.updateProfileById(userId, oldProfileEntities, function (result) {
            return callback(result);
        });
    },
};
