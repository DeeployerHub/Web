(function (angular) {
    'use strict';

    var extend = 'HeaderSignInMenuPostsController';
    var controller = 'PartialsProfilePostsController';

    var app = angular.module('deeployer');
    app.controller(controller, [
        '$scope', '$controller', '$http', '$compile', '$templateRequest', '$rootScope',
        function ($scope, $controller, $http, $compile, $templateRequest, $rootScope) {
            // inherit the classes on the header's
            $controller(extend, {
                $scope: $scope,
                $http: $http
            });

            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;

            $scope.moduleLoaded = true;
            $scope.requestInProgress = false;
            $scope.bottomSeeMore = false;
            $scope.postTopWaiting = false;
            $scope.postBottomWaiting = false;
            $scope.lastPostFetched = false;
            $scope.queue = [];
            $scope.start = 0;

            $scope.init = function () {
                setInterval(function () {
                    $('li[data-post-id]').each(function (id, obj) {
                        setTimeout(function () {
                            $scope.renderPostsDate($(obj)[0]);
                        }, 100);
                    });
                }, 10 * 1000);
            };

            $scope.renderNewPost = function (data) {
                $scope.postTopWaiting = true;
                $scope.renderPostsTop(data.post);
                $scope.postTopWaiting = false;
            };

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
                    $scope.bottomSeeMore = true;
                    $scope.postBottomWaiting = false;
                });
            };

            $scope.seeMore = function () {
                if (!$scope.postBottomWaiting && $scope.bottomSeeMore && !$scope.lastPostFetched) {
                    $scope.bottomSeeMore = false;
                    $scope.getPosts();
                }
            };

            $scope.renderPosts = function (posts) {
                for (var i in posts) {
                    if (posts[i] && !$scope.isIdExistedInQueue(posts[i]._id)) {
                        $scope.start++;
                        $scope.compileTemplate('postNormal.ng.html', {
                            post: posts[i]
                        }, function (html) {
                            $scope.renderPostsDate(html);
                            $('.post-area-bottom').before(html);
                        });
                    }
                }
            };

            $scope.renderPostsTop = function (posts) {
                for (var i in posts) {
                    if (posts[i] && !$scope.isIdExistedInQueue(posts[i]._id)) {
                        $scope.start++;
                        $scope.compileTemplate('postNormal.ng.html', {
                            post: posts[i]
                        }, function (html) {
                            $scope.renderPostsDate(html);
                            $('.post-area-top').after(html);
                        });
                    }
                }
            };

            $scope.renderPostsDate = function (html) {
                var post = $(html).find('[data-moment-date]');
                var momentResult = moment(new Date(post.data('moment-date'))).fromNow();
                post.html(momentResult);
            }

            $scope.isIdExistedInQueue = function (id) {
                if ($scope.queue.indexOf(id.toString()) === 0) {
                    return true
                } else {
                    $scope.queue.push(id.toString());
                    return false;
                }
            };

            $scope.getRequestedUsername = function () {
                return $('[data-username]').data('username');
            };

            $scope.getProfilePostsRequest = function (ok, fail) {
                var getQuery = {
                    start: $scope.start || undefined
                };

                if (!$scope.requestInProgress) {
                    $scope.requestInProgress = true;
                    $http({
                        method: 'GET',
                        url: '/posts/' + $scope.getRequestedUsername() + '/get-posts-json',
                        params: getQuery
                    }).then(function (result) {
                        // don't allow to request being send anymore in case the last request being empty
                        if (result.data.posts.length === 0 && !$scope.newestPost) {
                            $scope.lastPostFetched = true;
                        }
                        ok(result);
                        $scope.requestInProgress = false;
                    }, function () {
                        fail();
                        $scope.requestInProgress = false;
                    });
                }
            };

            $scope.compileTemplate = function (templateUrl, data, callback) {
                $templateRequest(templateUrl).then(function (html) {
                    var scope = $rootScope.$new();
                    var template = angular.element(html);
                    var interimScope = angular.extend(scope, data);
                    var compileResult = $compile(template)(interimScope);
                    setTimeout(function () {
                        callback(compileResult[0]);
                    }, 100);
                });
            };
        }
    ]);
})(window.angular);
window.onscroll = function () {
    if (document.body.scrollHeight == document.body.scrollTop + window.innerHeight) {
        setTimeout(function () {
            $('.btn-see-more').click();
        }, 100);
    }
};
