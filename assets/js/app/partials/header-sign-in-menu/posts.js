(function (angular) {
    'use strict';

    var controller = 'HeaderSignInMenuPostsController';

    var app = angular.module('deeployer');
    app.controller(controller, [
        '$scope', '$http',
        function ($scope, $http) {
            $scope.waiting          = false;
            $scope.content          = '';
            $scope.maxContentLength = 250;
            $scope.newPostModal     = $('#header-fix-signed-in-new-post-modal');

            $scope.newPostPopup = function () {
                $scope.newPostModal.modal({
                    backdrop: 'static'
                });
            };

            $scope.sendPost = function () {
                if (
                    ($scope.maxContentLength - $scope.content.length) >= 0 &&
                    ($scope.maxContentLength - $scope.content.length) < $scope.maxContentLength
                ) {
                    $scope.waiting = true;
                    $scope.composeRequest({
                        content: $scope.content
                    }, function (composeResponse) {
                        $.notify('<span class="text-muted">"' + composeResponse.data.post[0].content + '"</span> Posted!!!', 'success');
                        if ('function' === typeof $scope.renderNewPost) {
                            $scope.renderNewPost(composeResponse.data);
                        }
                        $scope.newPostModal.modal('hide');
                        $scope.content = '';
                        $scope.waiting = false;
                    }, function () {
                        $scope.waiting = false;
                    });
                }
            };

            $scope.composeRequest = function (data, ok, fail) {
                $http({
                    method: 'POST',
                    url: '/posts/compose',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(data)
                }).then(function (result) {
                    if (result.status) {
                        ok(result);
                    } else {
                        fail();
                    }
                }, function () {
                    fail();
                });
            };
        }
    ]);
})(window.angular);
