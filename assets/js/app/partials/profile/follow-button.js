(function(angular) {
    'use strict';

    angular.module('eloyt')
    .controller('PartialsProfileFollowButtonController', [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.followUser = function (requestedUsername) {
                $scope.status='following';

                $scope.request({
                    'action': 'follow',
                    'user'  : requestedUsername
                }, function (res) {
                    if (res.data.status) {
                        $scope.status='following';
                    } else {
                        $scope.status='not-following';
                    }
                }, function () {
                    $scope.status='not-following';
                });
            };

            $scope.unFollowUser = function (requestedUsername) {
                $scope.status='not-following';

                $scope.request({
                    'action': 'unfollow',
                    'user'  : requestedUsername
                }, function (res) {
                    if (res.data.status) {
                        $scope.status='not-following';
                    } else {
                        $scope.status='following';
                    }
                }, function () {
                    $scope.status='following';
                });
            };

            $scope.request = function (data, ok, fail) {
                $http({
                    method: 'POST',
                    url: '/profile/relation',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(data)
                })
                .then(function(result){
                    ok(result);
                }, function(result){
                    fail();
                });
            };
        }
    ]);
})(window.angular);
