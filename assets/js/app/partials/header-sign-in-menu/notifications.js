(function(angular) {
    'use strict';

    angular.module("deeployer")
    .controller("HeaderSignInMenuNotificationsController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.notificationsWaiting = false;
            $scope.unreadCount = 0;
            $scope.list = [];

            $scope.getNotifications = function() {
                $scope.notificationsWaiting = true;
                $http({
                    method: 'GET',
                    url: '/notifications/get-json',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function(result){
                    console.log('result', result);
                    $scope.notificationsWaiting = false;
                }, function(result){
                    $scope.notificationsWaiting = false;
                });
            }
        }
    ]);
})(window.angular);