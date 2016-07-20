dumpError = function (err) {
    'use strict';

    if (typeof err === 'object') {
        console.log('\n============================');
        if (err.message) {
            console.log('[CONSOLE.ERROR] Message: ' + err.message);
        }
        if (err.stack) {
            console.log('[CONSOLE.ERROR] Stacktrace:');
            console.log(err.stack);
        }
        console.log('============================\n');
    } else {
        console.log('\n============================');
        console.log('[CONSOLE.ERROR] Message: ' + err);
        console.log('============================\n');
    }
};

console.error = dumpError;
