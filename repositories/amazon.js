module.exports = {
    s3Upload: function (savedFile, fileToken, fileType, callback) {
        'use strict';
        
        var aws = require('aws-sdk'),
            fs = require('fs');

        aws.config.update({
            accessKeyId: getEnvConfig('tokens').aws.s3.accessKeyId, 
            secretAccessKey: getEnvConfig('tokens').aws.s3.secretAccessKey
        });

        var s3 = new aws.S3();
        var s3_params = {
            Bucket: getEnvConfig('tokens').aws.s3.bucket,
            Key: fileToken,
            ContentType: fileType,
            ACL: 'public-read'
        };

        var fileStream = fs.createReadStream(savedFile);
        fileStream.on('open', function () {
            var s3 = new aws.S3();
            s3.putObject({
                Bucket: getEnvConfig('tokens').aws.s3.bucket,
                Key: fileToken,
                Body: fileStream,
                ACL: 'public-read'
            }, callback);
        });
    }
};
