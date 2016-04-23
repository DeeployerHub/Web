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
    },
    getUserFollowers: function (userId, callback) {
        'use strict';

        var model = getModel('usersRelations');

        model.getFollowersList(userId, function (findRes) {
            var responseData = [];

            findRes.forEach(function (item) {
                var requestUserObject = item.requestUserId;

                var requestUserProfileObject = requestUserObject.profile.pop();
                responseData.push({
                    _id: requestUserObject._id,
                    avatar: requestUserObject.avatar,
                    username: requestUserObject.username,
                    firstname: requestUserProfileObject.firstname,
                    lastname: requestUserProfileObject.lastname
                });
            });

            callback(responseData);
        });
    }
};
