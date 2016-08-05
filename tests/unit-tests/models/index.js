module.exports = UnitTestsModels;

/**
 * UnitTestsModels class
 *
 * @returns {UnitTestsModels}
 * @constructor
 */
function UnitTestsModels (bundle) {
    'use strict';

    if (!(this instanceof UnitTestsModels)) {
        return new UnitTestsModels(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
UnitTestsModels.prototype.boot = function () {
    'use strict';

    require('./nodesPool')(this.bundle).runTestSuites();
};
