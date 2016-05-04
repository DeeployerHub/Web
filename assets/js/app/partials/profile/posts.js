(function (angular) {
    'use strict';

    $('body').attr('posts-scroll', '');
    $('body').attr('ng-controller', 'PartialsProfilePostsController');
    angular.module('deeployer')
        .controller('PartialsProfilePostsController', [
            '$scope', '$controller', '$http', '$compile', '$templateRequest', '$rootScope',
            function ($scope, $controller, $http, $compile, $templateRequest, $rootScope) {
                $scope.moduleLoaded = true;

                // inherit the classes on the header's
                $controller('HeaderSignInMenuPostsController', {
                    $scope: $scope
                });

                $scope.requestInProgress = false;
                $scope.bottomSeeMore     = false;
                $scope.postTopWaiting    = false;
                $scope.postBottomWaiting = false;
                $scope.lastPostFetched   = false;
                $scope.queue             = [];
                $scope.start             = 0;

                // posts page's zone
                $scope.getPosts = function () {
                    $scope.postBottomWaiting = true;
                    $scope.getProfilePostsRequest(function (resPosts) {
                        var data = resPosts.data;

                        $scope.renderPosts(data.posts);

                        $scope.postBottomWaiting = false;
                        if (data.posts.length < data.length) {
                            $scope.lastPostFetched = true;
                        } else {
                            $scope.bottomSeeMore = true;
                        }
                    }, function () {
                        $scope.bottomSeeMore     = true;
                        $scope.postBottomWaiting = false;
                    });
                };

                $scope.seeMore = function () {
                    $scope.bottomSeeMore = false;
                    $scope.getPosts();
                };

                $scope.renderPosts = function (posts) {
                    for (var i in posts) {
                        if (posts[i] && !$scope.isIdExistedInQueue(posts[i]._id)) {
                            $scope.start++;
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

                $scope.getProfilePostsRequest = function (ok, fail) {
                    var getQuery = {
                        start: $scope.start || undefined
                    };

                    if (!$scope.requestInProgress) {
                        $scope.requestInProgress = true;
                        $http({
                            method: 'GET',
                            url   : '/posts/' + $scope.username + '/get-posts-json',
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
                                $scope.requestInProgress = false;
                            }, function (result) {
                                fail();
                                $scope.requestInProgress = false;
                            });
                    }
                };

                $scope.compileTemplate = function (templateUrl, data, callback) {
                    $templateRequest(templateUrl).then(function (html) {
                        var scope         = $rootScope.$new();
                        var template      = angular.element(html);
                        var interimScope  = angular.extend(scope, data);
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
                    // angular.element($window).bind('scroll', function () {
                    //     if (this.pageYOffset >= 100) {
                    //         // load the rest of posts when scrollbar reached the end
                    //         if (!$scope.postBottomWaiting && !$scope.bottomSeeMore && !$scope.lastPostFetched) {
                    //             setTimeout(function () {
                    //                 $scope.seeMore();
                    //                 $scope.$apply();
                    //             }, 500);
                    //         }
                    //     }
                    // });
                }
            };
        });
})(window.angular);
