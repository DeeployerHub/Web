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
     *
     * @param sockets
     * @param socketId
     * 
     * @returns {*}
     */
    var broadcastCurrentSocketInfoToOthers = function (sockets, socketId) {
        return new Promise(function (resolve, reject) {
            // fetch the current socket's info
            socketRepo.fetchSocketsBySocketId(socketId).then(function (socketInfo) {
                // broadcast current socket's info to the audiences
                socketLocationsActions.parent.broadcast(sockets, 'refresh-users-in-map-view', socketInfo).then(function () {
                    resolve(true);
                }, reject);
            }, reject);
        });
    };

    var fetchSocketsInsight = function (socketId, center, corners) {
        return new Promise(function (resolve, reject) {
            socketRepo.fetchSocketsInSight(corners, socketId).then(function (sockets) {
                // uncomment next line in order to debug the results
                // console.log(sockets);

                // first step - send to current socket the list of online sockets in this region
                socket.emit('refresh-users-in-map-view', sockets);

                // second step - broadcast too all the users who are in this region
                broadcastCurrentSocketInfoToOthers(sockets, socketId).then(function () {
                    resolve(sockets);
                }, reject);
            }, reject);
        });
    };

    var storeInsightSockets = function (inSightSockets) {
        return new Promise(function (resolve, reject) {
            // store insight sockets into my socket's audience list
            socketRepo.pushSocketsIntoAudienceList(socket.id, inSightSockets).then(function (finalInSightSockets) {
                // store/push my socketId into insight socket's audienceList
                finalInSightSockets.forEach(function (targetAudienceSocketId) {
                    socketRepo.pushSocketsIntoAudienceList(targetAudienceSocketId, [socket.id]);
                });
                
                resolve();
            }, reject);
        });
    };

    socket.on('refresh-map-view', function (data) {
        socketRepo.refreshMapViewGeo(socket.id, data.center, data.corners).then(function () {
            fetchSocketsInsight(socket.id, data.center, data.corners).then(function (inSightSockets) {
                // store insight sockets into my socket's audience list
                storeInsightSockets(inSightSockets);
                // TODO:
                // Step 1: see who is not in the sight and remove this socket from their audience list
                // Step 2: remove the people who no longer in my sight from my audience list
            }, function (e) {
                console.error(e);
            });
        }, function (e) {
            console.error(e);
        });
    });
}
