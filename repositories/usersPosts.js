module.exports = {
    addNewPost: function (ownerUserId, content, callback) {
        'use strict';

        var model = getModel('usersPosts');

        model.addNewPost(ownerUserId, content, function (findRes) {
            callback(findRes);
        });
    }
};
