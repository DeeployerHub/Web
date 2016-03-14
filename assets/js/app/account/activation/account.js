(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("AccountController", [
        '$scope', '$http', 
        function ($scope, $http) {
            var avatarDefault = '/assets/images/users/default.png';
            $scope.waiting = false;
            $scope.avatar = avatarDefault;
            $scope.username = '';
            $scope.picValidationText = '';

            $scope.avatarClick = function () {
                var file     = document.createElement('input');
                file.type    = 'file';
                file.accept  = 'image/*';
                $(file).change($scope.avatarUploadChange);

                file.click();
            };

            $scope.avatarUploadChange = function () {
                var file = this.files.length > 0 ? this.files[0] : null;
                $scope.waiting = true;

                if (file) {
                    var fd = new FormData();
                    fd.append("file", file);
                    $http.post('/account/activation/account/avatar-upload', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(result){
                        $scope.avatar = result.data.file;
                    })
                    .error(function(result){
                        $scope.avatar = avatarDefault;
                        $scope.picValidationText = 'Process Failed! Please Try again.';
                        $scope.waiting = false;
                    });
                } else {
                    $scope.picValidationText = 'Process Failed! Please Try again.';
                    $scope.waiting = false;
                }
            };

            $scope.submitForm = function (form) {
                if (form.$valid) {
                    if ($scope.avatar === avatarDefault) {
                        $scope.picValidationText = 'You need to choose a Picture for your profile';
                        return;
                    }
                    // TODO: next
                }
            };

            $scope.stopWaiting = function (message) {
                $scope.picValidationText = message;
                $scope.editIconStatus = false;
                $scope.waiting = false;
            };
        }
    ])
    .directive('imageOnloadWaiting', function() {
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
