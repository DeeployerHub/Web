module.exports = {
    isFollowed: function (requestUserId, responseUserId, callback) {
        'use strict';

        var model = getModel('usersRelations');

        model.isFollowed(requestUserId, responseUserId, function (findRes) {
            callback(findRes);
        });
    },
    follow: function (requestUserId, responseUserId, callback) {
        'use strict';

        var model = getModel('usersRelations');

        model.follow(requestUserId, responseUserId, function (findRes) {
            callback(findRes);
        });
    },
    unfollow: function (requestUserId, responseUserId, callback) {
        'use strict';

        var model = getModel('usersRelations');

        model.unfollow(requestUserId, responseUserId, function (findRes) {
            callback(findRes);
        });
    }
};
