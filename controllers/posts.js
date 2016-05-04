module.exports = {
    compose: function (req, res) {
        'use strict';

        var usersPostsRepos = getRepos('usersPosts');

        var content = req.body.content;

        if (content.length > 250) {
            res.json({
                status: false
            });

            return;
        }

        usersPostsRepos.addNewPost(req.user._id, content, function (postRes) {
            if (postRes) {
                res.json({
                    status: true,
                    post  : postRes
                });
            } else {
                res.json({
                    status: false
                });
            }
        });
    },
    getProfilePostsJson: function (req, res) {
        'use strict';

        var userRepos = getRepos('users');
        var usersPostsRepos = getRepos('usersPosts');
        var start = req.query.start || 0;
        var length = req.query.length || 3;

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            usersPostsRepos.getProfilePosts(
                req.user._id,
                start,
                length,
                function (posts) {
                    if (posts) {
                        res.status(200).json({
                            posts: posts,
                            start: start,
                            length: length
                        });
                    } else {
                        res.status(200).json({
                            posts: [],
                            start: start,
                            length: length
                        });
                    }
                }
            );
        });
    }
};
