(function(angular) {
    'use strict';

    var controller = 'ConsoleController';

    var app = angular.module("deeployer");
    app.controller(controller, [
        '$scope', '$http', '$socketConnection', '$map',
        function ($scope, $http, $socketConnection, $map) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }

            window.controllers[controller] = this;

            $scope.mapCenterChangedTimeOut = $scope.mapCenterChangedTimeOut || null;
            $map.addListener('center_changed', function() {
                clearTimeout($scope.mapCenterChangedTimeOut);
                $scope.mapCenterChangedTimeOut = setTimeout(function () {
                    var currentViewCenter = $map.getViewCenter();

                    if (!angular.equals(window.lastViewCenter, currentViewCenter)) {
                        window.lastViewCenter = currentViewCenter;

                        $socketConnection.socket.emit('refresh-map-view', {
                            corners: $map.getCorners(),
                            center: currentViewCenter
                        });
                    }
                }, 200);
            });

            var markerCleanup = function (socketId) {
                $map.mapMarker = $map.mapMarker || {};

                if (socketId) {
                    if ($map.mapMarker.hasOwnProperty(socketId)) {
                        $map.mapMarker[socketId].setMap(null);
                        delete $map.mapMarker[socketId];
                    }

                    return;
                }

                for (var key in $map.mapMarker) {
                    if ($map.mapMarker.hasOwnProperty(socketId)) {
                        $map.mapMarker[key].setMap(null);
                        delete $map.mapMarker[key];
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

                var involved = $socketConnection.sockets.involved;
                for (var i in involved) {
                    if (involved[i]) {
                        var socket = involved[i];

                        markerCleanup();
                        var myLatLng = {lat: socket.mapViewCenter[0], lng: socket.mapViewCenter[1]};

                        $map.mapMarker[socket.socketId] = new google.maps.Marker({
                            position: myLatLng,
                            map: $map,
                            title: 'this is "' + socket.socketId.substr(socket.socketId.length - 4) + '"'
                        });
                    }
                }
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
