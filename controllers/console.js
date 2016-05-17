var userRepos = getRepos('users')();
module.exports = {
    console: function(req, res) {
        'use strict';
        
        userRepos.getUserInfo(req.user.email).then(function (userInfo) {
            res.render('console/pages/console', {
                socketRegion: 'test',
                user: userInfo
            });
        }, function (err) {
            console.error(err);

            errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
        });
    }
};
