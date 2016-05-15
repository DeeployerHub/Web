(function(angular) {
    'use strict';

    var controller = 'ProfileCoverController';

    var app = angular.module('deeployer');
    app.controller(controller, [
        '$scope', '$http', 
        function ($scope, $http) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;
            
            $scope.waiting = false;
            $scope.cover = window.angularControllerValues.cover || '';

            $scope.stopWaiting = function (message) {
                $scope.picValidationText = message;
                $scope.editCoverIconStatus = false;
                $scope.waiting = false;
            };

            $scope.coverClick = function () {
                $scope.picValidationText = '';
                var file     = document.createElement('input');
                file.type    = 'file';
                file.accept  = 'image/*';
                $(file).change($scope.coverUploadChange);

                file.click();
            };

            $scope.coverUploadChange = function () {
                var file = this.files.length > 0 ? this.files[0] : null;
                $scope.waiting = true;

                if (file) {
                    var fd = new FormData();
                    fd.append("file", file);
                    $http.post('/profile/cover-upload', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(result){
                        $scope.cover = result.data.file;
                        window.angularControllerValues.cover = $scope.cover;
                    })
                    .error(function(){
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
    app.directive('coverImageOnloadWaiting', function() {
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
