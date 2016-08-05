module.exports = UnitTestsMiddleware;

/**
 * UnitTestsMiddleware class
 *
 * @returns {UnitTestsMiddleware}
 * @constructor
 */
function UnitTestsMiddleware (bundle) {
    'use strict';

    if (!(this instanceof UnitTestsMiddleware)) {
        return new UnitTestsMiddleware(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
UnitTestsMiddleware.prototype.boot = function () {
    'use strict';

    console.warn('there is no middleware test');
};
