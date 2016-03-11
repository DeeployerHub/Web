'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('account/main.js');

    // route to specified controllers
    router.get('/sign-in', getMiddleware('account.consoleCheck'), controller.signIn);
    router.get('/sign-in/google/callback',
        getMiddleware('account.consoleCheck'),
        passport.authenticate('google', {
            failureRedirect: '/account/sign-in',
            successRedirect: '/'
        })
    );
    router.get('/sign-in/google',
        getMiddleware('account.consoleCheck'),
        passport.authenticate('google', {
            scope: [
                // for more info about scopes, visit:
                // https://developers.google.com/identity/protocols/googlescopes#oauth2v2
                'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            ]
        }));
    router.get('/sign-out', controller.signOut);

    // account activation
    router.get('/activation', getMiddleware('account.isUserActivated'), controller.activation);
    router.get('/activation/account', getMiddleware('account.isUserActivated'), controller.activationSteps.account);
    router.get('/activation/profile', getMiddleware('account.isUserActivated'), controller.activationSteps.profile);
    router.get('/activation/sharing', getMiddleware('account.isUserActivated'), controller.activationSteps.sharing);

    return router;
};