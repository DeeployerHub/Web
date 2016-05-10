var userRepos = getRepos('users')();

module.exports = {
    isUserActivated: function (req, res, next) {
        'use strict';

        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
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
    },
    consoleCheck: function (req, res, next) {
        'use strict';

        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
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
    },
    signInCheck: function (req, res, next) {
        'use strict';

        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
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
    },
    isSignedInUserActivated: function (req, res, next, callback) {
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
    }
};
