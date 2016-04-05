module.exports = {
    profile: function(req, res) {
        'use strict';

        var userRepos = getRepos('users');

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            res.render('profile/pages/profile', {
                user: userInfo
            });
        });
    }
};
