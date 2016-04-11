(function(angular) {
    'use strict';

    angular.module("deeployer")
    .controller("HeaderSignInMenuNotificationsController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.initialized = false;
            $scope.notificationsWaiting = false;
            $scope.unreadCount = 0;
            $scope.list = [];
            $scope.start = 0;


            $scope.getNotifications = function() {
                if (!$scope.isDropdownOpen()) {
                    $scope.notificationsWaiting = true;
                    if (!$scope.initialized) {
                        $scope.request([], function (result) {
                            if (result.statusText === 'OK') {
                                $scope.renderNotifications(result.data.items);
                                $scope.start = result.data.items.length;
                                $scope.initialized = true;
                            }

                            $scope.notificationsWaiting = false;
                        }, function () {
                            $scope.notificationsWaiting = false;
                        });
                    } else {
                        $scope.request([], function (result) {
                            if (result.statusText === 'OK') {
                                $scope.renderNotifications(result.data.items);
                                $scope.start += result.data.items.length;
                            }

                            $scope.notificationsWaiting = false;
                        }, function () {
                            $scope.notificationsWaiting = false;
                        });
                    }
                }
            };

            $scope.renderNotifications = function (items) {
                angular.forEach(items, function (notify) {
                    $scope.list.push(notify);
                });
            };

            $scope.isDropdownOpen = function () {
                return $('.dropdown-notification').hasClass('open');
            };

            $scope.request = function (data, ok, fail) {
                $http({
                    method: 'GET',
                    url: '/notifications/get-json',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
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