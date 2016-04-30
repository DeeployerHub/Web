(function (angular) {
    'use strict';

    angular.module("deeployer")
        .controller("HeaderSignInMenuPostsController", [
            '$scope', '$http',
            function ($scope, $http) {
                $scope.content = '';
                $scope.maxContentLength = 250;
                $scope.newPostModal = $('#header-fix-signed-in-new-post-modal');

                $scope.newPostPopup = function () {
                    $scope.newPostModal.modal({
                        backdrop: 'static'
                    });
                };

                $scope.sendPost = function () {
                    if (
                        (maxContentLength - content.length) >= 0 &&
                        (maxContentLength - content.length) < maxContentLength
                    ) {
                        $scope.request({
                            content: $scope.content
                        }, function () {
                            
                        }, function () {

                        });
                    }
                };

                $scope.request = function (data, ok, fail) {
                    $http({
                        method: 'POST',
                        url: '/profile/post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: $.param(data)
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
