(function(angular) {
    'use strict';

    angular.module("deeployer")
    .controller("SignOutController", [
        '$scope', 
        function ($scope) {
            $scope.waiting = false;
        }
    ]);
})(window.angular);