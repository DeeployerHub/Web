module.exports = {
    getJson: function(req, res) {
        'use strict';

        var start = req.body.start || 0;
        var length = req.body.length || 10;
        var userRepos = getRepos('users');

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            var items = [];
            setTimeout(function() {
                res.status(200).json({
                    items: items,
                    start: start,
                    length: length
                });
            }, 1000);
        });
    }
};
