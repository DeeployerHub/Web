module.exports = {
    isFollowed: function (requestUserId, responseUserId, callback) {
        'use strict';

        var model = getModel('usersRelations');

        model.isFollowed(requestUserId, responseUserId, function (findRes) {
            callback(findRes);
        });
    }
};
