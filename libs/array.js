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

    if (!toRemove) {
        return input;
    }

    for (var i = 0; i < input.length ; i++) {
        for (var j = 0; j < toRemove.length; j++) {
            if (input[i] === toRemove[j]) {
                input.splice(i, 1);
            }
        }
    }

    return input;
};

/**
 * return the difference of the second array against to first one
 *
 * @param arr1
 * @param arr2
 *
 * @returns []
 */
ArrayLib.prototype.diff = function (arr1, arr2) {
    'use strict';

    var arrayBank = [], diff = [];

    for (var index1 = 0; index1 < arr1.length; index1++) {
        arrayBank[arr1[index1]] = true;
    }

    for (var index2 = 0; index2 < arr2.length; index2++) {
        if (arrayBank[arr2[index2]]) {
            delete arrayBank[arr2[index2]];
        } else {
            arrayBank[arr2[index2]] = true;
        }
    }

    for (var iab in arrayBank) {
        if (arrayBank[iab]) {
            diff.push(iab);
        }
    }

    return diff;
};
