module.exports = {
    profile: function(req, res) {
        'use strict';

        var userRepos = getRepos('users');

        userRepos.getUserInfo(req.user.email, function (userInfo) {
            res.render('profile/pages/profile', {
                user: userInfo
            });
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
    }
};
