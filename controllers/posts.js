var userRepos = getRepos('users')();
var usersPostsRepos = getRepos('usersPosts')();

module.exports = {
    compose: function (req, res) {
        'use strict';

        var content = req.body.content;
        var position = {
            latitude: req.body.geoLatitude || undefined,
            longitude: req.body.geoLongitude || undefined,
        };

        if (content.length > 250) {
            res.json({
                status: false
            });

            return;
        }
        
        

        usersPostsRepos.addNewPost(req.user._id, content, position).then(function (postRes) {
            res.json({
                status: true,
                post  : postRes
            });
        }, function (err) {
            console.error(err);

            res.status(400).json({
                status: false
            });
        });
    },
    
    getProfilePostsJson: function (req, res, username) {
        'use strict';

        var start     = req.query.start || 0;
        var length    = req.query.length || 10;

        userRepos.getUserInfoByUsername(username).then(function (userInfo) {
            if (userInfo) {
                usersPostsRepos.getProfilePosts(
                    userInfo._id,
                    start,
                    length
                ).then(function (posts) {
                    if (posts) {
                        res.status(200).json({
                            posts : posts,
                            start : start,
                            length: length
                        });
                    } else {
                        res.status(200).json({
                            posts : [],
                            start : start,
                            length: length
                        });
                    }
                }, function (err) {
                    console.error(err);

                    res.status(400).json({
                        status: false
                    });
                });
            } else {
                res.status(404).json({
                    status: false
                });
            }
        }, function (err) {
            console.error(err);

            res.status(400).json({
                status: false
            });
        });
    }
};
