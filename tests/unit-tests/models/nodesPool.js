module.exports = NodesPoolTests;

//var model = getModel('NodesPool');

/**
 * NodesPoolTests Model
 *
 * @param bundle
 *
 * @returns {NodesPoolTests}
 * @constructor
 */
function NodesPoolTests (bundle) {
    'use strict';

    if (!(this instanceof NodesPoolTests)) {
        return new NodesPoolTests(bundle);
    }

    this.bundle = bundle;
}

/**
 * boot the test cases
 */
NodesPoolTests.prototype.runTestSuites = function () {
    'use strict';

    describe('nodes pool test suites', function() {
        it('#insert', function () {

        });
    });
};
