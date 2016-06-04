module.exports = AccountMiddleware;

var userRepos = getRepos('users')();

/**
 *  AccountMiddleware
 *
 * @returns {AccountMiddleware}
 * @constructor
 */
function AccountMiddleware () {
    'use strict';

    if (!(this instanceof AccountMiddleware)) {
        return new AccountMiddleware();
    }
}

var isSignedInUserActivated = function (req, res, next, callback) {
    'use strict';

    if (req.isAuthenticated()) {
        return userRepos.getUserInfo(req.user.email).then(function (activationResult) {
            if (!activationResult) {
                req.logout();
                return callback.signIn(req, res, next);
            }

            if (activationResult.activated) {
                return callback.signIn(req, res, next);
            } else {
                return callback.signOut(req, res, next);
            }
        }, function (err) {
            console.error(err);

            errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
        });
    } else {
        res.redirect('/account/sign-in');
    }
};

AccountMiddleware.prototype.isUserActivated = function (req, res, next) {
    'use strict';

    if (req.isAuthenticated()) {
        return isSignedInUserActivated(req, res, next, {
            signIn: function (reqIn, resIn) {
                resIn.redirect('/console');
            },
            signOut: function (reqIn, resIn, nextIn) {
                return nextIn();
            }
        });
    } else {
        res.redirect('/account/sign-in');
    }
};

AccountMiddleware.prototype.consoleCheck = function (req, res, next) {
    'use strict';

    if (req.isAuthenticated()) {
        return isSignedInUserActivated(req, res, next, {
            signIn: function (reqIn, resIn) {
                resIn.redirect('/console');
            },
            signOut: function (reqIn, resIn) {
                resIn.redirect('/account/activation');
            }
        });
    } else {
        return next();
    }
};

AccountMiddleware.prototype.signInCheck = function (req, res, next) {
    'use strict';

    if (req.isAuthenticated()) {
        return isSignedInUserActivated(req, res, next, {
            signIn: function (reqIn, resIn, nextIn) {
                return nextIn();
            },
            signOut: function (reqIn, resIn) {
                resIn.redirect('/account/activation');
            }
        });
    } else {
        res.redirect('/account/sign-in');
    }
};
