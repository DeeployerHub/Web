var socketRepo = getRepos('sockets')();

module.exports = Locations;
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

    socket.on('refresh-map-view', function (data) {
        socketRepo.refreshMapViewGeo(socket.id, data.center, data.corners).then(function (s) {
            // do some action when map view refreshed
        }, function (e) {
            console.error(e);
        });
    });
}

