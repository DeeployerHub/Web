(function(angular) {
    'use strict';

    var controller = 'AccountController';

    var app = angular.module('eloyt');
    app.controller(controller, [
        '$scope', '$http', 
        function ($scope, $http) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

            $scope.waiting = false;
            $scope.avatarDefault = '/assets/images/users/default.png';
            $scope.avatar = window.angularControllerValues.avatar || $scope.avatarDefault;
            $scope.username = '';
            $scope.picValidationText = '';

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
                    fd.append('file', file);
                    $http.post('/account/activation/account/avatar-upload', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(result){
                        $scope.avatar = result.data.file;
                        window.angularControllerValues.avatar = $scope.avatar;
                    })
                    .error(function(){
                        $scope.avatar = $scope.avatarDefault;
                        $scope.picValidationText = 'Process Failed! Please Try again.';
                        $scope.waiting = false;
                    });
                } else {
                    $scope.picValidationText = 'Process Failed! Please Try again.';
                    $scope.waiting = false;
                }
            };

            $scope.stopWaiting = function (message) {
                $scope.picValidationText = message;
                $scope.editIconStatus = false;
                $scope.waiting = false;
            };

            $scope.submitForm = function (form) {
                $scope.submitError       = '';
                $scope.picValidationText = '';
                if (form.$valid) {
                    if ($scope.avatar === $scope.avatarDefault) {
                        $scope.picValidationText = 'You need to choose a Picture for your profile';
                        return;
                    }

                    $http({
                        method: 'POST',
                        url: '/account/activation/account/submit',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: $.param({
                            username: $scope.username
                        })
                    })
                    .then(function(result){
                        if (result.data.status) {
                            window.location.href = '/account/activation/profile';
                        } else {
                            switch (result.data.reason) {
                                case 'username-already-exists':
                                    $scope.submitError = 'Username already exists.';
                                    break;
                                default:
                                    $scope.submitError = 'Process Failed! Please Try again.';
                            }
                        }
                    }, function(){
                        $scope.submitError = 'Process Failed! Please Try again.'
                    });
                }
            };
        }
    ]);
    app.directive('imageOnloadWaiting', function() {
        return {
            restrict: 'EA',
            controller: controller,
            link: function($scope, $element) {
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
