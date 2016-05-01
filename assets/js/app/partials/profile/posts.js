(function (angular) {
    'use strict';

    $('body').attr('posts-scroll', '');
    $('body').attr('ng-controller', 'PartialsProfilePostsController');
    angular.module('deeployer')
        .controller('PartialsProfilePostsController', [
            '$scope', '$controller', '$http', '$compile', '$templateRequest',
            function ($scope, $controller, $http, $compile, $templateRequest) {
                $scope.moduleLoaded = true;

                // inherit the classes on the header's
                $controller('HeaderSignInMenuPostsController', {
                    $scope: $scope
                });

                $scope.bottomTryAgain    = false;
                $scope.postTopWaiting    = false;
                $scope.postBottomWaiting = false;
                $scope.lastPostFetched   = true;
                $scope.queue             = [];

                // posts page's zone
                $scope.getPosts = function () {
                    $scope.postBottomWaiting = true;
                    $scope.request($scope.renderPosts,
                        function () {
                            $scope.bottomTryAgain    = true;
                            $scope.postBottomWaiting = false;
                        });
                };

                $scope.tryAgain = function () {
                    $scope.bottomTryAgain = false;
                    $scope.getPosts();
                };

                $scope.renderPosts = function (posts) {
                    for (var i in posts) {
                        if (posts[i] && !$scope.isIdExistedInQueue(posts[i]._id)) {
                            $scope.compileTemplate('postNormal.ng.html', {
                                post: posts[i]
                            }, function (html) {
                                $('.post-area-bottom').before(html);
                            });
                        }
                    }
                };

                $scope.isIdExistedInQueue = function (id) {
                    if ($scope.queue.indexOf(id.toString()) === 0) {
                        return true
                    } else {
                        $scope.queue.push(id.toString());
                        return false;
                    }
                };

                $scope.request = function (ok, fail) {
                    var getQuery = {
                        start: $scope.start || undefined
                    };

                    $http({
                        method: 'GET',
                        url   : '/profile/get-post-json',
                        params: getQuery
                    })
                        .then(function (result) {
                            // don't allow to request being send anymore incase the last request being empty
                            if (
                                result.data.posts.length === 0 && !$scope.newestPost
                            ) {
                                $scope.lastPostFetched = true;
                            }
                            ok(result);
                        }, function (result) {
                            fail();
                        });
                };

                $scope.compileTemplate = function (templateUrl, data, callback) {
                    $templateRequest(templateUrl).then(function (html) {
                        var template      = angular.element(html);
                        var interimScope  = angular.extend($scope, data);
                        var compileResult = $compile(template)(interimScope);

                        callback(compileResult[0]);
                    });
                };
            }
        ])
        .filter("ucwords", function () {
            return function (input) {
                if (input) { //when input is defined the apply filter
                    input = input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                }
                return input;
            }
        })
        .directive("postsScroll", function ($window) {
            return {
                restrict  : 'EA',
                controller: 'PartialsProfilePostsController',
                link      : function ($scope, $element, $attrs) {
                    angular.element($window).bind('scroll', function () {
                        if (this.pageYOffset >= 100) {
                            // load the rest of posts when scrollbar reached the end
                            if (!$scope.postBottomWaiting && !$scope.bottomTryAgain && !$scope.lastPostFetched) {
                                $scope.tryAgain();
                                $scope.$apply();
                            }
                        }
                    });
                }
            };
        });
})(window.angular);
