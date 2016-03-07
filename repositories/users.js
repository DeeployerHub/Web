module.exports = {
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

};
