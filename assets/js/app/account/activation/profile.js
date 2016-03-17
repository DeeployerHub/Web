(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("ProfileController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.profile = {
                firstname: '',
                lastname: '',
                phone: '',
                country: 'United State',
                gender: 'Male'
            };

            $scope.geoLocation = null;

            var positionRendering = function (position) {
                $scope.geoLocation = position;
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(positionRendering);
            }

            $scope.submitForm = function (form) {
                $http({
                    method: 'POST',
                    url: '/account/activation/profile/collect-point',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        firstname: $scope.profile.firstname,
                        lastname: $scope.profile.lastname,
                        phone: $scope.profile.phone,
                        country: $scope.profile.country,
                        gender: $scope.profile.gender,
                        geoLocation: $scope.geoLocation
                    })
                })
                .then(function(result){
                    if (result.data.status) {
                        window.location.href = '/account/activation/sharing';
                    } else {
                        switch (result.data.reason) {
                            default:
                                $scope.collectPointError = 'Process Failed! Please Try again.';
                        }
                    }
                }, function(result){
                    $scope.collectPointError = 'Process Failed! Please Try again.'
                });
            };
        }
    ]);
})(window.angular);
