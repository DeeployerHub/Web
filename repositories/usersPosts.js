module.exports = {
    addNewPost: function (ownerUserId, content, callback) {
        'use strict';

        var model = getModel('usersPosts');

        model.addNewPost(ownerUserId, content, function (findRes) {
            callback(findRes);
        });
    },

    getProfilePosts: function (userId, start, length, callback) {
        'use strict';

        var model      = getModel('usersPosts');
        var repository = getRepos('usersPosts');

        model.getPostsByOwnerId(userId, start, length, function (findRes) {
            if (findRes) {
                callback(findRes);
            } else {
                callback(null);
            }
        });
    },
};
