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

            res.render('account/pages/activation/account');
        },
        accountAvatarUpload: function (req, res) {
            'use strict';

            var path = require('path'),
                os = require('os'),
                uuid = require('node-uuid'),
                del = require('del'),
                fs = require('fs');

            var busboyPackage = require('busboy');
            var busboy = new busboyPackage({ headers: req.headers });
            var savedFileName = '';
            var savedFile = '';

            busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                savedFileName = uuid.v4() + path.extname(filename);
                savedFile = path.join(os.tmpDir() + '/upload', savedFileName);
                file.pipe(fs.createWriteStream(savedFile));
            });
            busboy.on('finish', function() {
                var aws = require('aws-sdk');

                aws.config.update({
                    accessKeyId: getEnvConfig('tokens').aws.s3.accessKeyId, 
                    secretAccessKey: getEnvConfig('tokens').aws.s3.secretAccessKey
                });

                var s3 = new aws.S3();
                var s3_params = {
                    Bucket: getEnvConfig('tokens').aws.s3.bucket,
                    Key: savedFileName,
                    ContentType: req.query.file_type,
                    ACL: 'public-read'
                };

                var fileStream = fs.createReadStream(savedFile);
                fileStream.on('open', function () {
                    var s3 = new aws.S3();
                    s3.putObject({
                        Bucket: getEnvConfig('tokens').aws.s3.bucket,
                        Key: savedFileName,
                        Body: fileStream,
                        ACL: 'public-read'
                    }, function (err, data) {
                        fs.unlink(savedFile);

                        if (err) {
                            res.json({
                                status: false,
                                reason: err
                            }); 
                        } else {
                            var s3file = 'https://' + getEnvConfig('tokens').aws.s3.bucket + '.s3.amazonaws.com/' + savedFileName;

                            // update the user's avatar into database
                            var userRepos = getRepos('users');

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
            });

            req.pipe(busboy);
        },
        profile: function (req, res) {
            'use strict';

            res.render('account/pages/activation/profile');
        },
        sharing: function (req, res) {
            'use strict';

            res.render('account/pages/activation/sharing');
        }
    }
};
