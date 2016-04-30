(function(angular) {
    'use strict';

    angular.module('deeployer')
    .controller('PartialsProfilePostsController', [
        '$scope', '$controller',
        function ($scope, $controller) {
            // inherit the classes on the header's
            $controller('HeaderSignInMenuPostsController', {
                $scope: $scope
            });

            // posts page's zone
            $scope.getPosts = function () {
                
            };
        }
    ])
    .filter("ucwords", function () {
        return function (input){
            if(input) { //when input is defined the apply filter
               input = input.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                  return letter.toUpperCase();
               });
            }
            return input; 
        }
    });
})(window.angular);
