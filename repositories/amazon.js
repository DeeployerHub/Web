module.exports = Amazon;

var Promise = require('promise');

/**
 *  Amazon Repository
 *
 * @returns {Amazon}
 * @constructor
 */
function Amazon () {
    'use strict';

    if (!(this instanceof Amazon)) {
        return new Amazon();
    }
}

/**
 * handle the amazon s3 upload
 *
 * @param savedFile
 * @param fileToken
 * @param fileType
 *
 * @returns {Promise}
 */
Amazon.prototype.s3Upload = function (savedFile, fileToken, fileType) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};

        var aws = require('aws-sdk'),
            fs  = require('fs');

        aws.config.update({
            accessKeyId: getEnvConfig('tokens').aws.s3.accessKeyId,
            secretAccessKey: getEnvConfig('tokens').aws.s3.secretAccessKey
        });

        var s3         = new aws.S3();
        var fileStream = fs.createReadStream(savedFile);
        fileStream.on('open', function () {
            s3.putObject({
                Bucket: getEnvConfig('tokens').aws.s3.bucket,
                Key: fileToken,
                Body: fileStream,
                ContentType: fileType,
                ACL: 'public-read'
            }, resolve);
        });
    });
};
