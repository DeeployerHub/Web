(function(angular) {
    'use strict';

    angular.module('deeployer')
    .controller('PartialsProfileAboutController', [
        '$scope', '$http', 
        function ($scope, $http) {
            $scope.rowSave = function (row, form) {
                $scope.waiting[row] = true;

                var data = {
                    row: row
                };
                if (row === 'name') {
                    data.firstname = $scope.userProfile.firstname;
                    data.lastname = $scope.userProfile.lastname;
                }
                if (row === 'phone') {
                    data.phone = $scope.userProfile.phone;
                }
                if (row === 'country') {
                    data.country = $scope.userProfile.country;
                }
                if (row === 'gender') {
                    data.gender = $scope.userProfile.gender;
                }

                $scope.request(data, function (result) {
                    $scope.userProfileDefault = $scope.cloneObject($scope.userProfile);
                    $scope.rowVisibility[row] = 'show';

                    $scope.waiting[row] = false;
                }, function () {
                    $scope.waiting[row] = false;
                });
            };

            $scope.request = function (data, ok, fail) {
                $http({
                    method: 'POST',
                    url: '/profile/about/update',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param(data)
                })
                .then(function(result){
                    if (result.data.status) {
                        ok(result);
                    } else {
                        fail();
                    }
                }, function(result){
                    fail();
                });
            };

            $scope.cloneObject = function (object) {
                return (JSON.parse(JSON.stringify(object)));
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