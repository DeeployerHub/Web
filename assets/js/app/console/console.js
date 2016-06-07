(function(angular) {
    'use strict';

    var controller = 'ConsoleController';

    var app = angular.module("deeployer");
    app.controller(controller, [
        '$scope', '$http', '$socketConnection',
        function ($scope, $http, $socketConnection) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

            var mapStyles = [{
                "featureType": "all",
                "elementType": "all",
                "stylers": [{"hue": "#000000"}, {"saturation": -100}, {"lightness": -30}]
            }, {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#ffffff"}]
            }, {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#353535"}]
            }, {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#656565"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#505050"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#808080"}]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#454545"}]
            }, {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [
                    {"hue": "#000000"},
                    {"saturation": -100},
                    {"lightness": -40},
                    {"invert_lightness": false},
                    {"gamma": 1.5}
                ]
            }];
            window.map = window.map || new google.maps.Map($('.map-view').get(0), {
                    scrollwheel: false,
                    styles: mapStyles,
                    zoom: 15,
                    maxZoom: 16,
                    minZoom: 13,
                    streetViewControl: false,
                    mapTypeControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

            window.mapCenterChangedTimeOut = window.mapCenterChangedTimeOut || null;
            window.map.addListener('center_changed', function() {
                var mapCenter = this.getCenter();
                var mapBounds = this.getBounds();
                clearTimeout(window.mapCenterChangedTimeOut);
                window.mapCenterChangedTimeOut = setTimeout(function () {
                    console.log(mapCenter, mapBounds);
                }, 200);
            });

            window.refreshLocationCount = 0;
            window.refreshLocation = function (position) {
                if (window.refreshLocationCount++ < 1) {
                    var pos = {
                        lat: position.latitude,
                        lng: position.longitude
                    };

                    window.map.setCenter(pos);
                    //var marker = new google.maps.Marker({
                    //    position: pos,
                    //    map: window.map,
                    //    title: 'Myself!'
                    //});
                }
            };
        }
    ]);
})(window.angular);