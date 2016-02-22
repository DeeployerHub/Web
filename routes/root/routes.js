module.exports = function() {
    var router = express.Router();
    var controller = getController('root/main.js');

    // route to specified controllers
    router.get('/', controller.landingPage);

    return router;
};
