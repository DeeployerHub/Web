require('./bootstrap');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    console.log('[CLUSTER] Worker' + (numCPUs > 1 ? 's': '') + ' count: "' + numCPUs.toString() + '"');

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[RIP] Worker "${worker.process.pid}" died.`);
        cluster.fork();
        console.log(`[CPR] Worker recovered.`);
    });
} else {
    // each worker run this server
    require('./server');
}
