(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("SharingController", [
        '$scope', '$http', 
        function ($scope, $http) {
            // facebook
            $scope.message = '';
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
                $http.post('/account/activation/sharing/agree', null, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(result){
                    window.location.href = '/';
                })
                .error(function(result){
                    $scope.message = 'Process Failed! Please Try again.';
                });
            };
        }
    ]);
})(window.angular);
