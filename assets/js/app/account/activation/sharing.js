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
                
            };
        }
    ]);
})(window.angular);
