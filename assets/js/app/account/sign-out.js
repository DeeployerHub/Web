(function(angular) {
    'use strict';

    var controller = 'SignOutController';

    angular.module('eloyt')
    .controller(controller, [
        '$scope', 
        function ($scope) {
            if (typeof window.controllers[controller] === 'object') {
                return;
            }
            window.controllers[controller] = this;
        }
    ]);
})(window.angular);