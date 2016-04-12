module.exports = {
    getJson: function (req, res) {
        'use strict';

        var userRepos = getRepos('users');
        var notificationRepos = getRepos('notifications');
        var start = req.query.start || 0;
        var length = req.query.length || 5;

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            notificationRepos.getNotifications(
                req.user._id,
                start,
                length,
                [
                    'isRead',
                    'type',
                    'attributes',
                    'registerAt'
                ],
                function (items) {
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
                }
            );
        });
    }
};
