module.exports = Locations;

var Promise                = require('promise');
var socketRepo             = getRepos('sockets')();
var socketAction           = getSocketActions(io);
var socketLocationsActions = socketAction.init('locations');

/**
 * handle the socket.io's Locations
 *
 * @param io
 * @param socket
 *
 * @returns {Locations}
 * @constructor
 */
function Locations (io, socket) {
    'use strict';

    if (!(this instanceof Locations)) {
        return new Locations(io, socket);
    }

    socket.on('refresh-location', function (data) {
        socketRepo.refreshGeoLocation(socket.id, data.position).then(function (s) {
            // do some action when location refreshed
        }, function (e) {
            console.error(e);
        });
    });

    /**
     * broadcast current socket's info to ther sockets
     * @param sockets
     * @param socketIds
     * 
     * @returns {*}
     */
    var broadcastCurrentSocketInfoToOthers = function (sockets, socketIds) {
        return new Promise(function (resolve, reject) {
            if (typeof socketIds === 'string') {
                socketIds = [socketIds];
            }

            socketIds.forEach(function (socketId) {
                // fetch the current socket's info
                socketRepo.fetchSocketsBySocketId(socketId).then(function (socketInfo) {
                    // broadcast current socket's info to the audiences
                    socketLocationsActions.parent.broadcast(sockets, 'refresh-users-in-map-view', {
                        sockets: socketInfo
                    }).then(function () {
                        resolve(true);
                    }, reject);
                }, reject);
            });
        });
    };

    /**
     * broadcast diff socket's info to ther sockets
     *
     * @param sockets
     * @param socketIds
     *
     * @returns {*}
     */
    var broadcastDiffToOthers = function (sockets, socketIds) {
        return new Promise(function (resolve, reject) {
            if (typeof socketIds === 'string') {
                socketIds = [socketIds];
            }

            socketIds.forEach(function (socketId) {
                // fetch the current socket's info
                socketRepo.fetchSocketsBySocketId(socketId).then(function (socketInfo) {
                    // broadcast current socket's info to the audiences
                    socketLocationsActions.parent.broadcast(sockets, 'refresh-users-in-map-view', {
                        diff: socketInfo
                    }).then(function () {
                        resolve(true);
                    }, reject);
                }, reject);
            });
        });
    };

    var refreshSocketsClientsView = function (socketId, sockets, socketsDiff) {
        return new Promise(function (resolve, reject) {
            // uncomment next line in order to debug the results

            // first step - send to current socket the list of online sockets in this region
            socket.emit('refresh-users-in-map-view', {
                sockets: sockets,
                diff: socketsDiff
            });

            // second step - broadcast too all the users who are in this region
            broadcastCurrentSocketInfoToOthers(sockets, socketId).then(function () {
                // third step - broadcast too all the removed Sockets
                broadcastDiffToOthers(socketsDiff, socket.id).then(function () {
                    resolve(sockets);
                }, reject);
            }, reject);
        });
    };

    var fetchSocketsInsight = function (socketId, center, corners) {
        return new Promise(function (resolve, reject) {
            socketRepo.fetchSocketsInSight(corners, socketId).then(function (sockets) {
                resolve(sockets);
            }, reject);
        });
    };

    /**
     * store insightSockets into socket's audience List
     *
     * @param inSightSockets
     *
     * @returns {*}
     */
    var storeInsightSockets = function (inSightSockets) {
        return new Promise(function (resolve, reject) {
            // store insight sockets into my socket's audience list
            socketRepo.pushSocketsIntoAudienceList(socket.id, inSightSockets).then(function (finalInSightSockets) {
                // store/push my socketId into insight socket's audienceList
                finalInSightSockets.forEach(function (targetAudienceSocketId) {
                    socketRepo.pushSocketsIntoAudienceList(targetAudienceSocketId, [socket.id]);
                });

                resolve(finalInSightSockets);
            }, reject);
        });
    };

    /**
     * remove outSightSockets from socket's audience list
     *
     * @param storedInsightSockets
     * @param outSightSockets
     *
     * @returns {*}
     */
    var removeOutSightSockets = function (storedInsightSockets, outSightSockets) {
        return new Promise(function (resolve, reject) {
            // remove insight sockets from my socket's audience list
            socketRepo.removeSocketsFromAudienceList(socket.id, storedInsightSockets, outSightSockets)
                      .then(function (result) {
                          var finalInSightSockets = result.audienceList;
                          var socketsDiffObj      = result.socketsDiffObj;

                          // store/push my socketId into insight socket's audienceList
                          for (var i in socketsDiffObj) {
                              if (socketsDiffObj.hasOwnProperty(i)) {
                                  socketRepo.removeSocketsFromAudienceListExtra(
                                      socketsDiffObj[i].socketId, [socket.id]
                                  );
                              }
                          }

                          resolve({
                              finalInSightSockets: finalInSightSockets,
                              socketsDiffObj: socketsDiffObj
                          });
                      }, reject);
        });
    };

    var socketDisconnect = function () {
        socketRepo.fetchSocketsBySocketId(socket.id).then(function (dcSockets) {
            var dcSocket = dcSockets.pop();

            // send dc socket id to the audiences to remove it from their audience list
            for (var i in dcSocket.audienceList) {
                if (dcSocket.audienceList.hasOwnProperty(i)) {
                    socketRepo.removeSocketsFromAudienceListExtra(
                        dcSocket.audienceList[i], [dcSocket.socketId]
                    );
                }
            }

            socketRepo.transformSocketId(dcSocket.audienceList).then(function (audienceList) {
                broadcastDiffToOthers(audienceList, dcSocket.socketId).then(function () {
                    return;
                }, function (e) {
                    console.error(e);
                });
            }, function (e) {
                console.error(e);
            });
        }, function (e) {
            console.error(e);
        });
    };

    var refreshMapView = function (data) {
        socketRepo.refreshMapViewGeo(socket.id, data.center, data.corners).then(function () {
            fetchSocketsInsight(socket.id, data.center, data.corners).then(function (inSightSockets) {
                // store insight sockets into my socket's audience list
                storeInsightSockets(inSightSockets).then(function (storedInsightSockets) {
                    removeOutSightSockets(storedInsightSockets, inSightSockets).then(function (result) {
                        var socketsDiffObj = result.socketsDiffObj;

                        refreshSocketsClientsView(socket.id, inSightSockets, socketsDiffObj);
                    }, function (e) {
                        console.error(e);
                    });
                }, function (e) {
                    console.error(e);
                });
            }, function (e) {
                console.error(e);
            });
        }, function (e) {
            console.error(e);
        });
    };

    socket.on('disconnect', socketDisconnect);

    socket.on('refresh-map-view', refreshMapView);
}
