module.exports = function() {
    var router = express.Router();
    var controller = getController('root/main.js');

    // route to specified controllers
    router.get('/', getMiddleware('general.consoleCheck'), controller.landingPage);

    return router;
};
