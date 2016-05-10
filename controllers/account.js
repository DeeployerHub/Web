module.exports = {
    signIn: function (req, res) {
        'use strict';

        res.render('account/pages/sign-in');
    },
    signOut: function (req, res) {
        'use strict';

        req.logout();
        res.render('account/pages/sign-out');
    },
    activation: function (req, res) {
        'use strict';

        res.render('account/pages/activation/main');
    },
    activationSteps: {
        account: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');

            userRepos.getUserInfo(req.user.email, function (userInfo) {
                if (userInfo.avatar && userInfo.username) {
                    res.redirect(301, '/account/activation/profile');
                } else {
                    res.render('account/pages/activation/account', {
                        user: userInfo
                    });
                }
            });
        },
        accountAvatarUpload: function (req, res) {
            'use strict';

            var path = require('path'),
                os = require('os'),
                uuid = require('node-uuid'),
                fs = require('fs');

            var userRepos = getRepos('users');
            var amazon = getRepos('amazon');
            var busboyPackage = require('busboy');
            var busboy = new busboyPackage({ headers: req.headers });
            var fileToken = '';
            var savedFile = '';

            busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                fileToken = uuid.v4() + path.extname(filename);
                savedFile = path.join(os.tmpDir() + '/upload', fileToken);
                file.pipe(fs.createWriteStream(savedFile));
            });
            busboy.on('finish', function() {
                amazon.s3Upload(savedFile, fileToken, req.query.file_type, function(err, data) {
                    fs.unlink(savedFile);
                    if (err) {
                        res.json({
                            status: false,
                            reason: err
                        }); 
                    } else {
                        var s3file = 'https://' + getEnvConfig('tokens').aws.s3.bucket + '.s3.amazonaws.com/' + fileToken;

                        // update the user's avatar into database

                        userRepos.updateAvatar(req.user._id, s3file, function () {
                            res.json({
                                status: true,
                                data: {
                                    file: s3file
                                }
                            });
                        });
                    }
                });
            });

            req.pipe(busboy);
        },
        accountCollectPoint: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');
            var notificationRepos = getRepos('notifications')();

            var username = req.body.username;
            if (username) {
                // validate the username
                userRepos.isUsernameExists(username, function (err) {
                    var returnData = {
                        status: true
                    };

                    if (err) {
                        returnData.status = false;
                        returnData.reason = 'username-already-exists';
                    }

                    if (returnData.status) {
                        userRepos.updateUsername(req.user._id, username, function () {
                            // increase the users's point for 50
                            userRepos.earnPoint(req.user._id, 50, {
                                point: 50,
                                type: 'activation',
                                reason: 'account-section-completed',
                                description: ''
                            }, function (pointsAfterAction) {
                                // send a notification
                                notificationRepos.sendNotification(req.user._id, 'normal', {
                                    text: 'Congrats, you earned +50 Points for setup your account.'
                                }).then(function () {
                                    returnData.pointsAfterAction = pointsAfterAction;
                                    res.json(returnData);
                                }, function (err) {
                                    console.error(err);

                                    res.status(400).json({
                                        status: false
                                    });
                                });
                            });
                        });
                    } else {
                        res.json(returnData);
                    }
                });
            } else {
                res.json({
                    status: false
                });
            }
        },
        profile: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');

            userRepos.getUserInfo(req.user.email, function (userInfo) {
                if (!(userInfo.avatar && userInfo.username)) {
                    res.redirect('/account/activation/account');
                } else {
                    // check if user already inserted the profile
                    if (userInfo.profile && userInfo.profile.length > 0) {
                        res.redirect('/account/activation/sharing');
                    } else {
                        res.render('account/pages/activation/profile', {
                            user: userInfo,
                            countries: getConfig('countries')
                        });
                    }
                }
            });
        },
        profileCollectPoint: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');
            var notificationRepos = getRepos('notifications')();

            var profile = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                country: req.body.country,
                gender: req.body.gender,
                geoLocation: req.body.geoLocation
            };

            if (
                profile.firstname &&
                profile.lastname &&
                profile.phone &&
                profile.country &&
                profile.gender
                ) {
                userRepos.updateProfile(req.user._id, profile, function () {
                    // increase the users's point for 50
                    userRepos.earnPoint(req.user._id, 50, {
                        point: 50,
                        type: 'activation',
                        reason: 'profile-section-completed',
                        description: ''
                    }, function () {
                        // send a notification
                        notificationRepos.sendNotification(req.user._id, 'normal', {
                            text: 'Congrats, you earned +50 Points for Complete your profile.'
                        }).then(function () {
                            res.json({
                                status: true
                            });
                        }, function (err) {
                            console.error(err);

                            res.status(400).json({
                                status: false
                            });
                        });
                    });
                });
            } else {
                res.json({
                    status: false
                });
            }
        },
        sharing: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');

            userRepos.getUserInfo(req.user.email, function (userInfo) {
                if (!(userInfo.avatar && userInfo.username)) {
                    res.redirect('/account/activation/account');
                } else {
                    // check if user already inserted the profile
                    if (!(userInfo.profile && userInfo.profile.length > 0)) {
                        res.redirect('/account/activation/profile');
                    } else {
                        res.render('account/pages/activation/sharing', {
                            user: userInfo
                        });
                    }
                }
            });
        },
        agree: function (req, res) {
            'use strict';

            var userRepos = getRepos('users');

            userRepos.getUserInfo(req.user.email, function (userInfo) {
                if (!(userInfo.avatar && userInfo.username)) {
                    res.json({
                        status: false
                    });
                } else {
                    // check if user already inserted the profile
                    if (!(userInfo.profile && userInfo.profile.length > 0)) {
                        res.json({
                            status: false
                        });
                    } else {
                        userRepos.updateActivation(req.user._id, true, function () {
                            res.json({
                                status: true
                            });
                        });
                    }
                }
            });
        }
    }
};
