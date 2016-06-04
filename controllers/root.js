module.exports = RootController;

/**
 *  RootController
 *
 * @returns {RootController}
 * @constructor
 */
function RootController () {
    'use strict';

    if (!(this instanceof RootController)) {
        return new RootController();
    }
}

/**
 * @param req
 * @param res
 */
RootController.prototype.landingPage = function (req, res) {
    'use strict';

    res.render('root/pages/landing-page', {
        message: "Hello World"
    });
};

/**
 * @param req
 * @param res
 */
RootController.prototype.staticSupport = function (req, res) {
    'use strict';

    res.render('root/pages/statics/support', {});
};

/**
 * @param req
 * @param res
 */
RootController.prototype.staticServicesFeatures = function (req, res) {
    'use strict';

    res.render('root/pages/statics/services-features', {});
};

/**
 * @param req
 * @param res
 */
RootController.prototype.staticTermsAndConditions = function (req, res) {
    'use strict';

    res.render('root/pages/statics/terms-and-conditions', {});
};
