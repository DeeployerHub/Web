module.exports = NodesPool;

var Promise = require('promise');
var model   = getModel('nodesPool')();

/**
 * NodesPool Repository
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
 * a node joins the pool
 *
 * @param proc
 *
 * @returns {Promise}
 */
NodesPool.prototype.join = function (proc) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.insert(proc).then(resolve, reject);
    });
};

/**
 * a node leaves the pool
 *
 * @param processId
 *
 * @returns {Promise}
 */
NodesPool.prototype.leaves = function (processId) {
    'use strict';

    return new Promise(function (resolve, reject) {
        resolve = resolve || function () {};
        reject  = reject || function () {};

        model.delete(processId).then(resolve, reject);
    });
};
