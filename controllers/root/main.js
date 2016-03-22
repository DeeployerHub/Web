module.exports = {
    landingPage: function(req, res) {
        'use strict';

        res.render('root/pages/landing-page', {
            message : "Hello World"
        });
    }
};