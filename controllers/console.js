module.exports = {
    console: function(req, res) {
        'use strict';

        var userRepos = getRepos('users');

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            res.render('console/pages/console', {
                user: userInfo
            });
        });
    }
};
