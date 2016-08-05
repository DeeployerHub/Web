module.exports = UnitTestsRepositories;

/**
 * UnitTestsRepositories class
 *
 * @returns {UnitTestsRepositories}
 * @constructor
 */
function UnitTestsRepositories (bundle) {
    'use strict';

    if (!(this instanceof UnitTestsRepositories)) {
        return new UnitTestsRepositories(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
UnitTestsRepositories.prototype.boot = function () {
    'use strict';

    console.warn('there is no repository test');
};
