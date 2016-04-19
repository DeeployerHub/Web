(function(angular) {
    'use strict';

    angular.module('deeployer')
    .controller('PartialsProfileFollowButtonController', [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.followUser = function () {
                $scope.status='following';
            };

            $scope.unFollowUser = function () {
                $scope.status='not-following';
            };
        }
    ]);
})(window.angular);