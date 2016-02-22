module.exports = {
    landingPage: function(req, res) {
        res.render('root/pages/landing-page', {
            message : "Hello World"
        });
    }
};