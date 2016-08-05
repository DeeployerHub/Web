module.exports = IntegrationTests;

/**
 * IntegrationTests class
 *
 * @returns {IntegrationTests}
 * @constructor
 */
function IntegrationTests (bundle) {
    'use strict';

    if (!(this instanceof IntegrationTests)) {
        return new IntegrationTests(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
IntegrationTests.prototype.boot = function () {
    'use strict';

};
