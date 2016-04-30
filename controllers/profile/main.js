module.exports = {
    profile: function(req, res, page, username) {
        'use strict';

        var controller = getController('profile/main.js');

        if (username) {
            if (req.isAuthenticated()) {
                controller.profileSigninShow(req, res, page, username);
            } else {
                controller.profileSignOutShow(req, res, page, username);
            }
        } else {
            controller.profileSelfShow(req, res, page, username);
        }
    },
    profileSigninShow: function(req, res, page, username) {
        'use strict';

        var userRepos = getRepos('users');
        var userRelationRepos = getRepos('usersRelations');

        userRepos.getUserInfo(req.user.email, function (signedInUser) {
            userRepos.getUserInfoByUsername(username, function (userInfo) {
                if (userInfo) {
                    userRelationRepos.isFollowed(signedInUser._id, userInfo._id, function (followed) {
                        res.render('profile/pages/profile', {
                            user         : signedInUser,
                            requestedUser: userInfo,
                            signedInUser : signedInUser,
                            page         : page,
                            followed     : (!followed ? 'not-' : '') + 'following'
                        });
                    });
                } else {
                    errorPageRender(res, 404, 'Sorry, this page isn\'t available');
                }
            });
        });
    },
    profileSignOutShow: function(req, res, page, username) {
        'use strict';

        var userRepos = getRepos('users');

        userRepos.getUserInfoByUsername(username, function (userInfo) {
            if (userInfo) {
                res.render('profile/pages/profile', {
                    user         : signedInUser,
                    requestedUser: userInfo,
                    signedInUser : null,
                    page         : page,
                    followed     : 'empty'
                });
            } else {
                errorPageRender(res, 404, 'Sorry, this page isn\'t available');
            }
        });
    },
    profileSelfShow: function(req, res, page, username) {
        'use strict';

        var userRepos = getRepos('users');

        userRepos.getUserInfo(req.user.email, function (signedInUser) {
            res.render('profile/pages/profile', {
                user         : signedInUser,
                requestedUser: signedInUser,
                signedInUser : signedInUser,
                page         : page,
                followed     : 'empty'
            });
        });
    },
    getFollowers: function(req, res, username) {
        'use strict';

        var userRepos = getRepos('users');
        var userRelationRepos = getRepos('usersRelations');


        userRepos.getUserInfoByUsername(username, function (targetedUserInfo) {
            userRelationRepos.getUserFollowers(targetedUserInfo._id, function (followers) {
                res.json({
                    status: true,
                    followers: followers
                });
            });
        });
    },
    profileAboutUpdate: function(req, res) {
        'use strict';

        var userRepos = getRepos('users');

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

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            userRepos.updateProfileEntities(req.user._id, userInfo.profile, data, function () {
                res.json({
                    status: true
                });
            });
        });
    },
    relation: function(req, res) {
        'use strict';

        var userRepos = getRepos('users');
        var userRelationRepos = getRepos('usersRelations');
        var notificationRepos = getRepos('notifications');

        // preparing input data
        var action         = req.body.action;
        var responseUsername = req.body.user;

        if (action === 'follow') {
            userRepos.getUserInfoByUsername(responseUsername, function (responseUser) {
                if (!responseUser) {
                    res.status(400);
                    res.json({
                        status: false
                    });
                }

                userRepos.getUserInfoById(req.user._id, function (requestUser) {
                    userRelationRepos.follow(requestUser._id, responseUser._id, function (followRes) {
                        // notify user
                        notificationRepos.sendNotification(responseUser._id, 'follow', {
                            text   : ucfirst(requestUser.username) + ' just followed you.',
                            pattern: '%requestUser.username% just followed you.',
                            arg    : {
                                requestUser: {
                                    _id     : requestUser._id,
                                    username: requestUser.username,
                                    email   : requestUser.email
                                }
                            }
                        }, function () {
                            res.json({
                                status: followRes
                            });
                        });
                    });
                });
            });
        }

        if (action === 'unfollow') {
            userRepos.getUserInfoByUsername(responseUsername, function (responseUser) {
                if (!responseUser) {
                    res.status(400);
                    res.json({
                        status: false
                    });
                }

                userRelationRepos.unfollow(req.user._id, responseUser._id, function (followRes) {
                    res.json({
                        status: followRes
                    });
                });
            });
        }
    },
    sendPost: function (req, res) {
        'use strict';

        var usersPostsRepos = getRepos('usersPosts');

        var content = req.body.content;

        if (content.length > 250) {
            res.json({
                status: false
            });

            return;
        }

        usersPostsRepos.addNewPost(req.user._id, content, function (postRes) {
            if (postRes) {
                res.json({
                    status: true,
                    post  : postRes
                });
            } else {
                res.json({
                    status: false
                });
            }
        });
    },
    profileAvatarUpload: function(req, res) {
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
    profileCoverUpload: function(req, res) {
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

                    userRepos.updateCover(req.user._id, s3file, function () {
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
    }
};
