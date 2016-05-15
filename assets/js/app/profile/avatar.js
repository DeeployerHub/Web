(function (angular) {
    'use strict';

    var controller = 'ProfileAvatarController';

    var app = angular.module('deeployer');
    app.controller(controller, [
        '$scope', '$http',
        function ($scope, $http) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

            $scope.waiting = false;
            $scope.avatar = window.angularControllerValues.avatar;

            $scope.stopWaiting = function (message) {
                $scope.picValidationText = message;
                $scope.editIconStatus = false;
                $scope.waiting = false;
            };

            $scope.avatarClick = function () {
                $scope.picValidationText = '';
                var file = document.createElement('input');
                file.type = 'file';
                file.accept = 'image/*';
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
                        .success(function (result) {
                            $scope.avatar = result.data.file;
                            window.angularControllerValues.avatar = $scope.avatar;
                        })
                        .error(function () {
                            $scope.picValidationText = 'Process Failed! Please Try again.';
                            $scope.waiting = false;
                        });
                } else {
                    $scope.picValidationText = 'Process Failed! Please Try again.';
                    $scope.waiting = false;
                }
            };

        }
    ]);
    app.directive('imageOnloadWaiting', function () {
        return {
            restrict: 'EA',
            controller: controller,
            link: function ($scope, $element) {
                $element.bind('load', function () {
                    $scope.$apply(function () {
                        $scope.stopWaiting('');
                    });
                });
                $element.bind('error', function () {
                    $scope.$apply(function () {
                        $scope.stopWaiting('Process Failed! Please Try again.');
                    });
                });
            }
        };
    });
})(window.angular);