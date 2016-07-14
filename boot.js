require('./bootstrap');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    console.log('[CLUSTER]\tWorker' + (numCPUs > 1 ? 's' : '') + ' count: "' + numCPUs.toString() + '"');

    cluster.on('exit', function (worker) {
        'use strict';

        console.log('[RIP]\t\tWorker "' + worker.process.pid + '" died.');
        cluster.fork();
        console.log('[CPR]\t\tWorker recovered.');
    });
} else {
    // each worker run this server
    require('./server');
}
