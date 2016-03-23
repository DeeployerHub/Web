(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("SharingController", [
        '$scope', '$http', 
        function ($scope, $http) {
            // facebook
            $scope.facebookSharing = function () {
                if (window.FB) {
                    FB.ui({
                        method: 'share',
                        href: 'http://deeployer.com'
                    });
                }
            };

            // twitter
            twttr.ready(function (twttr) {
                twttr.events.bind('tweet', function ( event ) {});
            });

            $scope.agreeWithConditions = function () {
                $http.post('/account/activation/sharing/agree', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(result){
                    $scope.avatar = result.data.file;
                    window.angularControllerValues.avatar = $scope.avatar;
                })
                .error(function(result){
                    $scope.avatar = $scope.avatarDefault;
                    $scope.picValidationText = 'Process Failed! Please Try again.';
                    $scope.waiting = false;
                });
            };
        }
    ]);
})(window.angular);
