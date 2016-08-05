module.exports = UnitTests;

/**
 * UnitTests class
 *
 * @returns {UnitTests}
 * @constructor
 */
function UnitTests (bundle) {
    'use strict';

    if (!(this instanceof UnitTests)) {
        return new UnitTests(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
UnitTests.prototype.boot = function () {
    'use strict';

    require('./middleware')(this.bundle).boot();
    require('./models')(this.bundle).boot();
    require('./repositories')(this.bundle).boot();
};
