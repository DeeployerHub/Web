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
                    $socketConnection.socket.emit('refresh-map-view', {
                        corners: $map.getCorners(),
                        center: $map.getViewCenter()
                    });
                }, 200);
            });

            var markerCleanup = function (socketId) {
                $map.mapMarker = $map.mapMarker || {};

                if (socketId) {
                    if ($map.mapMarker.hasOwnProperty(socketId)) {
                        $map.mapMarker[socketId].setMap(null);
                        delete $map.mapMarker[socketId];
                    }
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
                    $socketConnection.sockets.involved[socket._id] = socket;
                    markerCleanup(socket._id);
                });

                diff.forEach(function (socket) {
                    delete $socketConnection.sockets.involved[socket._id];
                    markerCleanup(socket._id);
                });

                var involved = $socketConnection.sockets.involved;
                for (var i in involved) {
                    if (involved[i]) {
                        var socket = involved[i];

                        $map.mapMarker = $map.mapMarker || {};

                        var myLatLng = {lat: socket.mapViewCenter[0], lng: socket.mapViewCenter[1]};

                        $map.mapMarker[socket._id] = new google.maps.Marker({
                            position: myLatLng,
                            map: $map,
                            title: 'this is "' + socket._id + '"'
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
