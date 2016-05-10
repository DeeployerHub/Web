var userRepos = getRepos('users')();
var notificationRepos = getRepos('notifications')();

module.exports = {
    getJson: function (req, res) {
        'use strict';

        var start = req.query.start || 0;
        var length = req.query.length || 5;

        userRepos.getUserInfo(req.user.email).then(function (userInfo) {
            notificationRepos.getNotifications(
                userInfo._id,
                start,
                length,
                [
                    'isRead',
                    'type',
                    'attributes',
                    'registerAt'
                ]
            ).then(function (items) {
                if (items) {
                    res.status(200).json({
                        items: items,
                        start: start,
                        length: length
                    });
                } else {
                    res.status(200).json({
                        items: [],
                        start: start,
                        length: length
                    });
                }
            }, function (err) {
                console.error(err);

                res.status(400).json({
                    status: false
                });
            });
        }, function (err) {
            console.error(err);

            res.status(400).json({
                status: false
            });
        });
    }
};
