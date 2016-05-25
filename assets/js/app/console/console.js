(function(angular) {
    'use strict';

    var controller = 'ConsoleController';

    var app = angular.module("deeployer");
    app.controller(controller, [
        '$scope', '$http', '$socketConnection',
        function ($scope, $http, $socketConnection) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;
        }
    ]);
})(window.angular);