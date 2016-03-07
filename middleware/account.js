module.exports = {
    isUserActivated: function (req, res, next) {
        'use strict';

        return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
            signIn: function (req, res, next) {
                res.redirect('/console');
            },
            signOut: function (req, res, next) {
                return next(); 
            }
        });
    },
    consoleCheck: function (req, res, next) {
        'use strict';

        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
                signIn: function (req, res, next) {
                    res.redirect('/console');  
                },
                signOut: function (req, res, next) {
                    res.redirect('/account/activation');
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
                signIn: function (req, res, next) {
                    return next();
                },
                signOut: function (req, res, next) {
                    res.redirect('/account/activation');
                }
            });
        } else {
            res.redirect('/account/sign-in');
        }
    },
    isSignedInUserActivated: function (req, res, next, callback) {
        'use strict';

        var userRepos = getRepos('users');

        return userRepos.isUserActivated(req.user.email, function (activationResult) {
            if (activationResult.activated) {
                return callback.signIn(req, res, next);
            } else {
                return callback.signOut(req, res, next);
            }
        });
    }
};
