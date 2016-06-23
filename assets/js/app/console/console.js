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

            $socketConnection.socket.on('refresh-users-in-map-view', function (sockets) {
                if (sockets.length === 0) {
                    return;
                }

                sockets.forEach(function (socket) {
                    console.log(socket._id);
                    $socketConnection.sockets.involved[socket._id] = socket;
                    var myLatLng = {lat: socket.mapViewCenter[0], lng: socket.mapViewCenter[0]};

                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: $map,
                        title: 'Hello World!'
                    });
                });
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
