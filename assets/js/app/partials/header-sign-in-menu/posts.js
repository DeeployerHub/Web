(function (angular) {
    'use strict';

    var controller = 'HeaderSignInMenuPostsController';

    var app = angular.module('eloyt');
    app.controller(controller, [
        '$scope', '$http', '$socketConnection',
        function ($scope, $http, $socketConnection) {
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
                    var composeData = {
                        content: $scope.content,
                        geoLocation: window.geoLocationPositions,
                        mapView: undefined,
                        mapCenterView: undefined,
                        region: $socketConnection.region
                    };

                    if (window.map && window.map.getCorners && window.map.getViewCenter) {
                        composeData.mapView       = window.map.getCorners();
                        composeData.mapCenterView = window.map.getViewCenter();
                    }

                    $scope.composeRequest(composeData, function (composeResponse) {
                        $.notify('<span class="text-muted">"' +
                            composeResponse.data.post[0].content + '"</span> Posted!!!', 'success');

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
                    data: data
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
