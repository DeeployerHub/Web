(function(angular) {
    'use strict';

    var controller = 'SharingController';

    var app = angular.module('eloyt');
    app.controller(controller, [
        '$scope', '$http', 
        function ($scope, $http) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

            // facebook
            $scope.message = '';
            $scope.facebookSharing = function () {
                if (window.FB) {
                    FB.ui({
                        method: 'share',
                        href: 'https://eloyt.com'
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
                .success(function(){
                    window.location.href = '/';
                })
                .error(function(){
                    $scope.message = 'Process Failed! Please Try again.';
                });
            };
        }
    ]);
})(window.angular);
