var app = angular.module("deeployer", []);

app.controller("account", [
    '$scope', '$http', 
    function ($scope, $http) {
        'use strict';

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

            if (file) {
                var fd = new FormData();
                fd.append("file", file);
                $http.post('/account/activation/account/avatar-upload', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(result){
                    console.log(result);
                    return result.data;
                })
                .error(function(result){
                    console.log(result);
                });
            } else {
                $scope.picValidationText = 'Process Failed! Please Try again.';
            }
        };

        $scope.submitForm = function (form) {
            if (form.$valid) {

            }
        };
    }
]);
