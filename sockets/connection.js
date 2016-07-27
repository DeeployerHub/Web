var Promise       = require('promise');
var socketsRepo   = getRepos('sockets')();
var nodesPoolRepo = getRepos('nodesPool')();
var Deligations   = require('./delegations');

module.exports = Connection;

/**
 * handle the socket.io connection
 * @param base
 * @returns {Connection}
 * @constructor
 */
function Connection (base) {
    'use strict';

    if (!(this instanceof Connection)) {
        return new Connection(base);
    }

    var localSockets          = {};
    localSockets[process.pid] = [];

    var cleanUpSockets = function (signal) {
        console.info('[GC]\t\t' + process.pid, signal.toUpperCase());

        return new Promise(function (resolve, reject) {
            localSockets[process.pid].forEach(function (socketId) {
                socketsRepo.disconnect(socketId).then(function () {
                    base.io.connected[socketId].disconnect();
                }, reject);
            });

            process.exitCode = 1;

            if  (signal === 'exit') {
                console.info('[POOL]\t\tPID:', process.pid, 'HAS LEFT THE POOL');
                nodesPoolRepo.leaves(process.pid).then(resolve, reject).then(resolve, reject);

                return;
            }

            resolve();
        });
    };

    var finalExit = function () {
        process.exitCode = 1;
        process.exit(1);
    };

    var leavingFailed = function () {
        console.error(e);

        finalExit();
    };

    console.info('[POOL]\t\tPID:', process.pid, 'HAS JOINED THE POOL');
    nodesPoolRepo.join(process);
    ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit'].forEach(function (signal) {
        process.on(signal, function () {
            cleanUpSockets(signal).then(function () {
                setTimeout(function () {
                    if (signal !== 'SIGINT') {
                        finalExit();
                    } else {
                        if (process.send === undefined) {
                            finalExit();
                        }
                    }
                }, 100);
            }, function (e) {
                console.error(e);

                finalExit();
            });
        });
    });

    var socketDisconnectAction = function (socket, process) {
        // remove socket from database
        socketsRepo.disconnect(socket.id).then(function () {
            localSockets[process.pid].remove(localSockets[process.pid].indexOf(socket.id));
        }, function (err) {
            console.error(err);
        });
    };

    base.io.on('connection', function (socket) {
        var region = socket.handshake.query.region || null;
        socketsRepo.connect(socket.session.user._id, socket.id, region).then(function () {
            localSockets[process.pid].push(socket.id);

            // handle the deligations
            new Deligations(base.io, socket);

            // handle the disconnect
            socket.on('disconnect', function () {
                setTimeout(function () {
                    socketDisconnectAction(socket, process);
                }, 100);
            });
        }, function (err) {
            console.error(err);
            socket.disconnect();
        });
    });
}
