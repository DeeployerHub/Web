module.exports = {
    isUserActivated: function (req, res, next) {
        'use strict';


        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
                signIn: function (reqIn, resIn, nextIn) {
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
                signIn: function (reqIn, resIn, nextIn) {
                    resIn.redirect('/console');  
                },
                signOut: function (reqIn, resIn, nextIn) {
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
                signOut: function (reqIn, resIn, nextIn) {
                    resIn.redirect('/account/activation');
                }
            });
        } else {
            res.redirect('/account/sign-in');
        }
    },
    isSignedInUserActivated: function (req, res, next, callback) {
        'use strict';

        var userRepos = getRepos('users');

        if (req.isAuthenticated()) {
            return userRepos.isUserActivated(req.user.email, function (activationResult) {
                if (activationResult.activated) {
                    return callback.signIn(req, res, next);
                } else {
                    return callback.signOut(req, res, next);
                }
            });
        } else {
            res.redirect('/account/sign-in');
        }
    }
};
