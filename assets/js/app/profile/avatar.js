(function(angular) {
    'use strict';

    angular.module("deeployer", [])
    .controller("ProfileAvatarController", [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.waiting = false;
            $scope.avatar = window.angularControllerValues.avatar || $scope.avatarDefault;

            $scope.stopWaiting = function (message) {
                $scope.picValidationText = message;
                $scope.editIconStatus = false;
                $scope.waiting = false;
            };

            $scope.avatarClick = function () {
                $scope.picValidationText = '';
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
                    $http.post('/profile/avatar-upload', fd, {
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
                } else {
                    $scope.picValidationText = 'Process Failed! Please Try again.';
                    $scope.waiting = false;
                }
            };

        }
    ])
    .directive('imageOnloadWaiting', function() {
        return {
            restrict: 'EA',
            controller: 'ProfileAvatarController',
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