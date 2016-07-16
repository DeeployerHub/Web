module.exports = ArrayLib;

/**
 *  Array Lib
 *      library for work on arrays
 *
 * @returns {ArrayLib}
 * @constructor
 */
function ArrayLib () {
    'use strict';

    if (!(this instanceof ArrayLib)) {
        return new ArrayLib();
    }
}

/**
 * return an array with unique data
 *
 * @param array
 * @param data
 *
 * @returns []
 */
ArrayLib.prototype.unique = function (array, data) {
    'use strict';

    data = data || null;

    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j] || a[i] === data) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
};

/**
 * substract an array from input
 *
 * @param input
 * @param toRemove
 *
 * @returns []
 */
ArrayLib.prototype.substract = function (input, toRemove) {
    'use strict';

    for (var i = input.length - 1; i >= 0; i--) {
        for (var j = 0; j < toRemove.length; j++) {
            if (input[i] && toRemove[j]) {
                input.splice(i, 1);
            }
        }
    }

    return input;
};

/**
 * return the difference of the second array against to first one
 *
 * @param a1
 * @param a2
 *
 * @returns []
 */
ArrayLib.prototype.diff = function (a1, a2) {
    'use strict';

    var a = [], diff = [];

    for (var i1 = 0; i1 < a1.length; i1++) {
        a[a1[i1]] = true;
    }

    for (var i2 = 0; i2 < a2.length; i2++) {
        if (a[a2[i2]]) {
            delete a[a2[i2]];
        } else {
            a[a2[i2]] = true;
        }
    }

    for (var k in a) {
        if (a) {
            diff.push(k);
        }
    }

    return diff;
};
