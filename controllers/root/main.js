module.exports = {
    landingPage: function(req, res) {
        'use strict';

        res.render('root/pages/landing-page', {
            message : "Hello World"
        });
    },
    static: {
        support: function(req, res) {
            'use strict';

            res.render('root/pages/statics/support', {});
        },
        servicesFeatures: function(req, res) {
            'use strict';

            res.render('root/pages/statics/services-features', {});
        },
        termsAndConditions: function(req, res) {
            'use strict';

            res.render('root/pages/statics/terms-and-conditions', {});
        }
    }
};
