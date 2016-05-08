module.exports = function() {
    'use strict';

    var router = express.Router();
    var controller = getController('root');

    // route to specified controllers
    router.get('/', getMiddleware('account.consoleCheck'), controller.landingPage);
    io.on('connection', function (sock) {
        sock.on('hi-back', function() {
            console.log(sock);
        });
    });
    router.get('/bc', function (req, res) {
        io.emit('hi', req.isAuthenticated());
        res.send('send');
    });

    // static pages
    router.get('/support', controller.static.support);
    router.get('/services-features', controller.static.servicesFeatures);
    router.get('/terms-and-conditions', controller.static.termsAndConditions);

    return router;
};
