(function(angular) {
    'use strict';

    angular.module('deeployer')
    .controller('PartialsProfileFollowersController', [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.waiting = true;
            $scope.followers = [
                {
                    _id: 'asdfasdfasdf',
                    avatar: 'https://deeployerdev.s3.amazonaws.com/9c793eb6-d8fa-4fb0-8b7e-c77c0fa98c37.jpg',
                    username: 'mahan',
                    firstname: 'dummy',
                    lastname: 'user1'
                },
                {
                    _id: 'asdfasdfasdf',
                    avatar: 'https://deeployerdev.s3.amazonaws.com/9c793eb6-d8fa-4fb0-8b7e-c77c0fa98c37.jpg',
                    username: 'test',
                    firstname: 'dummy',
                    lastname: 'user2'
                }
            ];
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