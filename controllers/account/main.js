module.exports = {
    signIn: function(req, res) {
        res.render('account/pages/sign-in');
    },
    signOut: function(req, res) {
        res.render('account/pages/sign-out');
    }
};
