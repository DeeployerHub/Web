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
            var savedFile = '';

            busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                savedFile = path.join(os.tmpDir() + '/upload', uuid.v4() + path.extname(filename));
                file.pipe(fs.createWriteStream(savedFile));
            });
            busboy.on('finish', function() {
                del(savedFile,{
                    dryRun: true,
                    force: true
                });
                res.json({
                    status: true,
                    data: {
                        file: savedFile
                    }
                });
            });

            req.pipe(busboy);

            // var aws = require('aws-sdk');

            // aws.config.region = getEnvConfig('tokens').aws.s3.regin;


            // aws.config.update({
            //     accessKeyId: getEnvConfig('tokens').aws.s3.accessKeyId, 
            //     secretAccessKey: getEnvConfig('tokens').aws.s3.secretAccessKey
            // });

            // var fileName = uuid.v4();
            // var s3 = new aws.S3();
            // var s3_params = {
            //     Bucket: getEnvConfig('tokens').aws.s3.bucket,
            //     Key: fileName,
            //     ContentType: req.query.file_type,
            //     ACL: 'public-read'
            // };
            // s3.getSignedUrl('putObject', s3_params, function(err, data){
            //     if(err){
            //         console.log(err);
            //         res.json({
            //             status: false,
            //         });
            //     }
            //     else{
            //         var return_data = {
            //             signed_request: data,
            //             url: 'https://' +
            //             getEnvConfig('tokens').aws.s3.bucket +
            //             '.s3.amazonaws.com/' + fileName
            //         };

            //         res.json({
            //             status: true,
            //             data: {
            //                 file: return_data
            //             }
            //         });
            //     }
            // });
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
