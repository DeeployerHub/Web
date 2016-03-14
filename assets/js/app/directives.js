(function(angular) {
    var app = angular.module("deeployer");

    app.directive('imageOnloadWaiting', function() {
        return {
            restrict: 'EA',
            controller: 'AccountController',
            link: function($scope, $element, $attrs) {
                $element.bind('load', function() {
                    $scope.$apply(function() {
                        $scope.stopWaiting('');
                    });
                });
                $element.bind('error', function() {
                    $scope.$apply(function() {
                        $scope.stopWaiting('Process Failed! Please Try again.');
                    });
                });
            }
        };
    });
})(window.angular);
