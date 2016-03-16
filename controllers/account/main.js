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
                            dispatchEvent('earnPoint', {
                                point: 50,
                                type: 'activation',
                                reason: 'account-section-completed',
                                description: ''
                            });

                           res.json(returnData); 
                        })
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
                    res.render('account/pages/activation/profile', {
                        user: userInfo
                    });
                }
            });
        },
        sharing: function (req, res) {
            'use strict';

            res.render('account/pages/activation/sharing');
        }
    }
};
