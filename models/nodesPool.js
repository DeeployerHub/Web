module.exports = NodesPool;

var Promise         = require('promise');
var mongoose        = require('mongoose');
var nodesPoolSchema = getModelSchema('nodesPool');

/**
 * NodesPool Model
 *
 * @returns {NodesPool}
 * @constructor
 */
function NodesPool () {
    'use strict';

    if (!(this instanceof NodesPool)) {
        return new NodesPool();
    }
}

/**
 * insert process information into DB
 *
 * @param proc
 *
 * @returns {Promise}
 */
NodesPool.prototype.insert = function (proc) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        var nodesPool = new nodesPoolSchema({
            pid: proc.pid,
            execPath: proc.execPath,
            platform: proc.platform,
            argv: proc.argv,
        });

        nodesPool.save(function (err, res) {
            if (err) {
                reject(err);

                return;
            }

            resolve(res);
        });
    });
};

/**
 * remove process information from db
 *
 * @param processId
 *
 * @returns {Promise}
 */
NodesPool.prototype.delete = function (processId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        nodesPoolSchema
            .find({
                pid: processId
            })
            .remove(function (err, res) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(res.result.ok > 0);
            })
            .exec();
    });
};
