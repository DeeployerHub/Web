module.exports = {
    consoleCheck: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/console');
        } else {
            return next();
        }
    },
    signInCheck: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/account/sign-in');
        }
    }
};
