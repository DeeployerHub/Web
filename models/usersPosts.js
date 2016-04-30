module.exports = {
    addNewPost: function (ownerUserId, content, result) {
        'use strict';

        var mongoose         = require('mongoose');
        var usersPostsSchema = getModelSchema('usersPosts');

        var newUserPost = new usersPostsSchema({
            ownerUserId: mongoose.Types.ObjectId(ownerUserId),
            content    : content
        });

        newUserPost.save(function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res);
        });
    }
};
