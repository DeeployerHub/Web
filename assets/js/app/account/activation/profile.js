(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("ProfileController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.geoLocationSpan = '';
            $scope.geoLocation = null;
            $scope.geoLocationSupport = false;

            var positionRendering = function (position) {
                $scope.geoLocation = position;
                console.log(position);
            };

            if (navigator.geolocation) {
                $scope.geoLocationSupport = true;
                navigator.geolocation.getCurrentPosition(positionRendering);
            }
        }
    ]);
})(window.angular);
