module.exports = {
    signIn: function(req, res) {
        res.render('account/pages/sign-in', {
            message : "sign in page"
        });
    }
};
