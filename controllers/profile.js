var userRepos         = getRepos('users')();
var userRelationRepos = getRepos('usersRelations')();
var notificationRepos = getRepos('notifications')();
var amazon            = getRepos('amazon')();

module.exports = {
    profile: function(req, res, page, username) {
        'use strict';

        var controller = getController('profile');

        if (username) {
            if (req.isAuthenticated()) {
                controller.profileSigninShow(req, res, page, username);
            } else {
                controller.profileSignOutShow(req, res, page, username);
            }
        } else {
            controller.profileSelfShow(req, res, page);
        }
    },
    profileSigninShow: function(req, res, page, username) {
        'use strict';


        userRepos.getUserInfo(req.user.email).then(function (signedInUser) {
            userRepos.getUserInfoByUsername(username).then(function (userInfo) {
                if (userInfo) {
                    userRelationRepos.isFollowed(signedInUser._id, userInfo._id).then(function (followed) {
                        res.render('profile/pages/profile', {
                            user         : signedInUser,
                            requestedUser: userInfo,
                            signedInUser : signedInUser,
                            page         : page,
                            followed     : (!followed ? 'not-' : '') + 'following'
                        });
                    }, function (err) {
                        console.error(err);

                        errorPageRender(res, 404, 'Sorry, this page isn\'t available');
                    });
                } else {
                    errorPageRender(res, 404, 'Sorry, this page isn\'t available');
                }
            }, function (err) {
                console.error(err);

                errorPageRender(res, 404, 'Sorry, this page isn\'t available');
            });
        }, function (err) {
            console.error(err);

            errorPageRender(res, 404, 'Sorry, this page isn\'t available');
        });
    },
    profileSignOutShow: function(req, res, page, username) {
        'use strict';

        userRepos.getUserInfoByUsername(username).then(function (userInfo) {
            if (userInfo) {
                res.render('profile/pages/profile', {
                    user         : null,
                    requestedUser: userInfo,
                    signedInUser : null,
                    page         : page,
                    followed     : 'empty'
                });
            } else {
                errorPageRender(res, 404, 'Sorry, this page isn\'t available');
            }
        }, function (err) {
            console.error(err);

            errorPageRender(res, 404, 'Sorry, this page isn\'t available');
        });
    },
    profileSelfShow: function(req, res, page) {
        'use strict';

        userRepos.getUserInfo(req.user.email).then(function (signedInUser) {
            res.render('profile/pages/profile', {
                user         : signedInUser,
                requestedUser: signedInUser,
                signedInUser : signedInUser,
                page         : page,
                followed     : 'empty'
            });
        }, function (err) {
            console.error(err);

            errorPageRender(res, 404, 'Sorry, this page isn\'t available');
        });
    },
    getFollowers: function(req, res, username) {
        'use strict';

        userRepos.getUserInfoByUsername(username).then(function (targetedUserInfo) {
            userRelationRepos.getUserFollowers(targetedUserInfo._id).then(function (followers) {
                res.json({
                    status: true,
                    followers: followers
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
    },
    profileAboutUpdate: function(req, res) {
        'use strict';

        // preparing input data
        var profileData = req.body;
        var row = profileData.row;
        delete profileData.row;

        var data = {};
        if (row === 'name') {
            data.firstname = profileData.firstname;
            data.lastname = profileData.lastname;
        }
        if (row === 'phone') {
            data.phone = profileData.phone;
        }
        if (row === 'country') {
            data.country = profileData.country;
        }
        if (row === 'gender') {
            data.gender = profileData.gender;
        }

        userRepos.getUserInfo(req.user.email).then(function (userInfo) {
            userRepos.updateProfileEntities(req.user._id, userInfo.profile, data).then(function () {
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
    },
    relation: function(req, res) {
        'use strict';


        // preparing input data
        var action         = req.body.action;
        var responseUsername = req.body.user;

        if (action === 'follow') {
            userRepos.getUserInfoByUsername(responseUsername).then(function (responseUser) {
                userRepos.getUserInfoById(req.user._id).then(function (requestUser) {
                    userRelationRepos.follow(requestUser._id, responseUser._id).then(function (followRes) {
                        // notify user
                        notificationRepos.sendNotification(responseUser._id, requestUser._id, 'follow', {
                            text   : ucfirst(requestUser.username) + ' just followed you.',
                            pattern: '%requestUser.username% just followed you.'
                        }).then(function () {
                            res.json({
                                status: followRes
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
            }, function (err) {
                console.error(err);

                res.status(400).json({
                    status: false
                });
            });
        }

        if (action === 'unfollow') {
            userRepos.getUserInfoByUsername(responseUsername).then(function (responseUser) {
                userRelationRepos.unfollow(req.user._id, responseUser._id).then(function (followRes) {
                    res.json({
                        status: followRes
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
        }
    },
    profileAvatarUpload: function(req, res) {
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
            }, function (err) {
                console.error(err);

                res.status(400).json({
                    status: false
                });
            });
        });

        req.pipe(busboy);
    },
    profileCoverUpload: function(req, res) {
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
                    userRepos.updateCover(req.user._id, s3file).then(function () {
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
            }, function (err) {
                console.error(err);

                res.status(400).json({
                    status: false
                });
            });
        });

        req.pipe(busboy);
    }
};
