(function(angular) {
    'use strict';

    var controller = 'ProfileController';
    
    var app = angular.module('eloyt');
    app.controller(controller, [
        '$scope', '$http', 
        function ($scope, $http) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

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
                }, function(){
                    $scope.collectPointError = 'Process Failed! Please Try again.'
                });
            };
        }
    ]);
})(window.angular);
