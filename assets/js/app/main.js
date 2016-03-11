(function(app) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log(app);
        for (var i in app) {
            if (typeof i === 'string') {
                var suffix = 'Component';
                if (i.indexOf(suffix, i.length - suffix.length) !== -1)
                ng.platform.browser.bootstrap(app[i]);
            }
        }
    });
})(window.app || (window.app = {}));
