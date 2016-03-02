module.exports = {
    signIn: function(req, res) {
        res.render('account/pages/sign-in');
    },
    signOut: function(req, res) {
        req.logout();
        res.render('account/pages/sign-out');
    },
    activation: function(req, res) {
        res.render('account/pages/activation/main');
    },
    activationSteps: {
        account: function(req, res) {
            res.render('account/pages/activation/account');
        },
        profile: function(req, res) {
            res.render('account/pages/activation/profile');
        },
        sharing: function(req, res) {
            res.render('account/pages/activation/sharing');
        }
    }
};
