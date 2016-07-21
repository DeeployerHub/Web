(function (angular) {
    'use strict';

    angular.module('eloyt')
        .controller('PartialsProfileFollowersController', [
            '$scope', '$http',
            function ($scope, $http) {
                $scope.waiting   = true;
                $scope.followers = [];
                $scope.init      = function () {
                    $scope.waiting = true;
                    $scope.request($scope.requestedUsername, function (res) {
                        $scope.followers = res.data.followers;
                        $scope.waiting   = false;
                    }, function () {
                        $scope.waiting = false;
                    })
                };
                $scope.request   = function (username, ok, fail) {
                    $http({
                        method : 'GET',
                        url    : '/profile/' + username + '/followers/get-json',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(function (result) {
                            if (result.data.status) {
                                ok(result);
                            } else {
                                fail();
                            }
                        }, function (result) {
                            fail();
                        });
                };
            }
        ])
        .filter("ucwords", function () {
            return function (input) {
                if (input) { //when input is defined the apply filter
                    input = input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                }
                return input;
            }
        });
})(window.angular);
