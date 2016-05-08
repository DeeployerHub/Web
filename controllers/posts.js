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
                    post: postRes
                });
            } else {
                res.json({
                    status: false
                });
            }
        });
    },
    getProfilePostsJson: function (req, res, username) {
        'use strict';

        var userRepos = getRepos('users');
        var usersPostsRepos = getRepos('usersPosts');
        var start = req.query.start || 0;
        var length = req.query.length || 10;

        userRepos.getUserInfoByUsername(username, function (userInfo) {
            if (userInfo) {
                usersPostsRepos.getProfilePosts(
                    userInfo._id,
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
            } else {
                res.status(404).json({
                    status: false
                });
            }
        });
    }
};
