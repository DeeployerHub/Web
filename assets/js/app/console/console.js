(function(angular) {
    'use strict';

    var controller = 'ConsoleController';

    var app = angular.module("eloyt");
    app.controller(controller, [
        '$scope', '$http', '$socketConnection', '$map',
        function ($scope, $http, $socketConnection, $map) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }

            window.controllers[controller] = this;

            var mapCenterChangedTimeOut;
            $map.addListener('center_changed', function() {
                clearTimeout(mapCenterChangedTimeOut);
                mapCenterChangedTimeOut = setTimeout(function () {
                    var currentCorners    = $map.getCorners();
                    var currentViewCenter = $map.getViewCenter();

                    if (!currentViewCenter || !currentCorners) {
                        return;
                    }

                    if (!angular.equals(window.lastViewCenter, currentViewCenter)) {
                        window.lastViewCenter = currentViewCenter;

                        $socketConnection.socket.emit('refresh-map-view', {
                            corners: currentCorners,
                            center: currentViewCenter
                        });
                    }
                }, 200);
            });

            /**
             * remove the marker from the map
             *
             * @param socketId
             */
            var markerRemove = function (socketId) {
                $map.mapMarker = $map.mapMarker || {};

                if ($map.mapMarker.hasOwnProperty(socketId)) {
                    $map.mapMarker[socketId].setMap(null);
                    delete $map.mapMarker[socketId];
                }
            };

            /**
             * cleanup the map from markers and get ready to remove them
             *
             * @param socketId
             */
            var markerCleanup = function (socketId) {
                if (socketId) {
                    markerRemove();

                    return;
                }

                for (var sid in $map.mapMarker) {
                    if ($map.mapMarker.hasOwnProperty(sid)) {
                        markerRemove(sid);
                    }
                }
            };

            /**
             * draw a new marker on the map
             *
             * @param socketId
             * @param position
             */
            var markerDraw = function (socketId, position) {
                $map.mapMarker = $map.mapMarker || {};

                $map.mapMarker[socketId] = new google.maps.Marker({
                    position: position,
                    map: $map,
                    title: 'this is "' + socketId.substr(socketId.length - 4) + '"'
                });
            };

            /**
             * cleanup and draw markers on the map
             */
            var markerDrawInvolved = function () {
                markerCleanup();

                var involved = $socketConnection.sockets.involved;

                for (var i in involved) {
                    if (involved.hasOwnProperty(i)) {
                        var socket   = involved[i];
                        var myLatLng = {lat: socket.mapViewCenter[0], lng: socket.mapViewCenter[1]};

                        markerDraw(i, myLatLng);
                    }
                }
            };

            $socketConnection.socket.on('refresh-users-in-map-view', function (data) {
                var sockets = data.sockets || [];
                var diff    = data.diff || [];

                sockets.forEach(function (socket) {
                    $socketConnection.sockets.involved[socket.socketId] = socket;
                    markerCleanup(socket.socketId);
                });

                diff.forEach(function (socket) {
                    delete $socketConnection.sockets.involved[socket.socketId];
                    markerCleanup(socket.socketId);
                });

                markerDrawInvolved();
            });

            $socketConnection.socket.on('disconnect', function () {
                markerCleanup();
                $socketConnection.sockets.involved = [];
            });

            window.refreshLocationCount = 0;
            window.refreshLocation = function (position) {
                if (window.refreshLocationCount++ < 1) {
                    var pos = {
                        lat: position.latitude,
                        lng: position.longitude
                    };

                    $map.setCenter(pos);
                }
            };
        }
    ]);
})(window.angular);
