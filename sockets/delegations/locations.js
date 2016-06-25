module.exports = Locations;

var Promise    = require('promise');
var socketRepo = getRepos('sockets')();

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

    var fetchSocketsInsight = function (socketId, center, corners) {
        return new Promise(function (resolve, reject) {
            socketRepo.fetchSocketsInSight(corners, socketId).then(function (data) {
                // uncomment next line in order to debug the results
                //console.log(data);
                // broadcast too all the users who are in this region 
                // and add following user to the list of audiences
                socket.emit('refresh-users-in-map-view', data);
            }, reject);
        });
    };

    socket.on('refresh-map-view', function (data) {
        socketRepo.refreshMapViewGeo(socket.id, data.center, data.corners).then(function (s) {
            fetchSocketsInsight(socket.id, data.center, data.corners).then(function () {}, function () {
                console.error(e);
            });
        }, function (e) {
            console.error(e);
        });
    });
}
