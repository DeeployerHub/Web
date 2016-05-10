var model = getModel('users')();

module.exports = {
    isUsernameExists: function (username, callback) {
        'use strict';

        model.findUserWithUsername(username).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    getUserInfo: function (email, callback) {
        'use strict';

        model.findUserWithEmail(email).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    getUserInfoByUsername: function (username, callback) {
        'use strict';

        model.findUserWithUsername(username).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    getUserInfoById: function (userId, callback) {
        'use strict';

        model.findUserWithId(userId).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        }, function (err) {
            console.error(err);

            callback(null);            
        });
    },
    isUserRegistered: function (profile, email, callback) {
        'use strict';

        model.findUserWithEmail(email).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                model.registerNewUser(email).then(function (registerRes) {
                    callback(registerRes, profile);
                }, function (err) {
                    console.log(err);
                    
                    callback(null);
                });
            }
        }, function (err) {
            console.error(err);
            
            model.registerNewUser(email).then(function (registerRes) {
                callback(registerRes, profile);
            }, function (err) {
                console.log(err);

                callback(null);
            });
        });
    },
    isUserActivated: function (email, callback) {
        'use strict';

        model.findUserWithEmail(email).then(function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    updateAvatar: function (userId, avatarPath, callback) {
        'use strict';

        model.updateUserAvatarById(userId, avatarPath).then(function (result) {
            callback(result);
        }, function (err) {
            conosle.log(err);
            
            callback(null);
        });
    },
    updateCover: function (userId, coverPath, callback) {
        'use strict';

        model.updateUserCoverById(userId, coverPath).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);
            
            callback(null);
        });
    },
    updateUsername: function (userId, username, callback) {
        'use strict';

        model.updateUsernameById(userId, username).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);
            
            callback(null);
        });
    },
    updateProfile: function (userId, profile, callback) {
        'use strict';

        model.updateProfileById(userId, profile).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);
            
            callback(null);
        });
    },
    updateActivation: function (userId, value, callback) {
        'use strict';

        model.updateActivationById(userId, value).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    earnPoint: function (userId, value, attributes, callback) {
        'use strict';

        model.increasePoints(userId, value, attributes).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
    updateProfileEntities: function (userId, oldProfileEntities, profileEntities, callback) {
        'use strict';

        oldProfileEntities = oldProfileEntities.pop();

        for (var index in profileEntities) {
            if (index) {
                oldProfileEntities[index] = profileEntities[index];
            }
        }

        model.updateProfileById(userId, oldProfileEntities).then(function (result) {
            callback(result);
        }, function (err) {
            console.error(err);

            callback(null);
        });
    },
};
