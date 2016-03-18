(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("SharingController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.facebookSharing = function () {
                FB.ui({
                    method: 'share',
                    href: 'http://deeployer.com'
                }, function(response) {
                    if (typeof response === 'object') {
                        $scope.userShared('facebook');
                    }
                });
            };

            $scope.userShared = function (bridge) {
                // TODO: send request to server to activate the user
            };
        }
    ]);
})(window.angular);
