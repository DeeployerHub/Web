module.exports = {
    isUserActivated: function(req, res, next) {
        return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
            signIn: function(req, res, next) {
                res.redirect('/console');
            },
            signOut: function(req, res, next) {
                return next(); 
            }
        });
    },
    consoleCheck: function(req, res, next) {
        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
                signIn: function(req, res, next) {
                    res.redirect('/console');  
                },
                signOut: function(req, res, next) {
                    res.redirect('/account/activation');
                }
            });
        } else {
            return next();
        }
    },
    signInCheck: function(req, res, next) {
        if (req.isAuthenticated()) {
            return getMiddleware('account.isSignedInUserActivated')(req, res, next, {
                signIn: function(req, res, next) {
                    return next();
                },
                signOut: function(req, res, next) {
                    res.redirect('/account/activation');
                }
            });
        } else {
            res.redirect('/account/sign-in');
        }
    },
    isSignedInUserActivated: function(req, res, next, callback) {
        // TODO: it suppose to check db to see the user is activated or not
        if (false) {
            return callback.signIn(req, res, next);
        } else {
            return callback.signOut(req, res, next);
        }
    },
};
