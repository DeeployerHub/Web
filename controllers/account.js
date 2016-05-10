var userRepos         = getRepos('users')();
var notificationRepos = getRepos('notifications')();
var amazon            = getRepos('amazon')();

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

            userRepos.getUserInfo(req.user.email).then(function (userInfo) {
                if (userInfo.avatar && userInfo.username) {
                    res.redirect(301, '/account/activation/profile');
                } else {
                    res.render('account/pages/activation/account', {
                        user: userInfo
                    });
                }
            }, function (err) {
                console.error(err);

                errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
            });
        },
        accountAvatarUpload: function (req, res) {
            'use strict';

            var path = require('path'),
                os = require('os'),
                uuid = require('node-uuid'),
                fs = require('fs');

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
                amazon.s3Upload(savedFile, fileToken, req.query.file_type).then(function(err) {
                    fs.unlink(savedFile);
                    if (!err) {
                        var s3file = 'https://' + getEnvConfig('tokens').aws.s3.bucket + '.s3.amazonaws.com/' + fileToken;
                        // update the user's avatar into database
                        userRepos.updateAvatar(req.user._id, s3file).then(function () {
                            res.json({
                                status: true,
                                data: {
                                    file: s3file
                                }
                            });
                        }, function (err) {
                            console.error(err);

                            res.status(400).json({
                                status: false
                            });
                        });
                    } else {
                        console.error(err);

                        res.status(400).json({
                            status: false,
                            reason: err
                        });
                    }
                }, null);
            });

            req.pipe(busboy);
        },
        accountCollectPoint: function (req, res) {
            'use strict';

            var username = req.body.username;
            if (username) {
                // validate the username
                userRepos.isUsernameExists(username).then(function (status) {
                    if (!status) {
                        userRepos.updateUsername(req.user._id, username).then(function () {
                            // increase the users's point for 50
                            userRepos.earnPoint(req.user._id, 50, {
                                point: 50,
                                type: 'activation',
                                reason: 'account-section-completed',
                                description: ''
                            }).then(function (pointsAfterAction) {
                                // send a notification
                                notificationRepos.sendNotification(req.user._id, 'normal', {
                                    text: 'Congrats, you earned +50 Points for setup your account.'
                                }).then(function () {
                                    res.json({
                                        status: true,
                                        pointsAfterAction: pointsAfterAction
                                    });
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
                        }, function (err) {
                            console.error(err);

                            res.status(400).json({
                                status: false
                            });
                        });
                    } else {
                        res.json({
                            status: false,
                            reason: 'username-already-exists'
                        });
                    }
                }, function (err) {
                    console.error(err);

                    res.status(400).json({
                        status: false
                    });
                });
            } else {
                res.json({
                    status: false
                });
            }
        },
        profile: function (req, res) {
            'use strict';

            userRepos.getUserInfo(req.user.email).then(function (userInfo) {
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
            }, function (err) {
                console.error(err);

                errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
            });
        },
        profileCollectPoint: function (req, res) {
            'use strict';

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
                userRepos.updateProfile(req.user._id, profile).then(function () {
                    // increase the users's point for 50
                    userRepos.earnPoint(req.user._id, 50, {
                        point: 50,
                        type: 'activation',
                        reason: 'profile-section-completed',
                        description: ''
                    }).then(function () {
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
            } else {
                res.json({
                    status: false
                });
            }
        },
        sharing: function (req, res) {
            'use strict';

            userRepos.getUserInfo(req.user.email).then(function (userInfo) {
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
            }, function (err) {
                console.error(err);

                errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
            });
        },
        agree: function (req, res) {
            'use strict';

            userRepos.getUserInfo(req.user.email).then(function (userInfo) {
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
                        userRepos.updateActivation(req.user._id, true).then(function () {
                            res.json({
                                status: true
                            });
                        }, function (err) {
                            console.error(err);

                            res.status(400).json({
                                status: false
                            });
                        });
                    }
                }
            }, function (err) {
                console.error(err);

                res.status(400).json({
                    status: false
                });
            });
        }
    }
};
