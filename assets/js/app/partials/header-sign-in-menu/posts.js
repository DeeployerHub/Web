(function (angular) {
    'use strict';

    angular.module("deeployer")
        .controller("HeaderSignInMenuPostsController", [
            '$scope', '$http',
            function ($scope, $http) {
                $scope.maxContentLength = 250;
                $scope.newPostModal = $('#header-fix-signed-in-new-post-modal');

                $scope.newPostPopup = function () {
                    $scope.newPostModal.modal({
                        backdrop: 'static'
                    });
                }
            }
        ]);
})(window.angular);