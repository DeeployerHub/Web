'use strict';

var router     = express.Router();
var controller = getController('account')();
var middleware = getMiddleware('account')();

module.exports = function () {
    // route to specified controllers
    router.get(
        '/sign-in',
        middleware.consoleCheck,
        controller.signIn
    );
    router.get(
        '/sign-in/google/callback',
        middleware.consoleCheck,
        passport.authenticate('google', {
            failureRedirect: '/account/sign-in',
            successRedirect: '/'
        })
    );
    router.get(
        '/sign-in/google',
        middleware.consoleCheck,
        passport.authenticate('google', {
            scope: [
                // for more info about scopes, visit:
                // https://developers.google.com/identity/protocols/googlescopes#oauth2v2
                // https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds
                'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            ]
        }));
    router.get(
        '/sign-out',
        controller.signOut
    );

    // account activation
    router.post(
        '/activation/account/collect-point',
        middleware.isUserActivated,
        controller.activationStepsAccountCollectPoint
    );
    router.post(
        '/activation/account/avatar-upload',
        middleware.isUserActivated,
        controller.activationStepsAccountAvatarUpload
    );
    router.get(
        '/activation/account',
        middleware.isUserActivated,
        controller.activationStepsAccount
    );
    router.get(
        '/activation/profile',
        middleware.isUserActivated,
        controller.activationStepsProfile
    );

    router.post(
        '/activation/profile/collect-point',
        middleware.isUserActivated,
        controller.activationStepsProfileCollectPoint
    );
    router.get(
        '/activation/sharing',
        middleware.isUserActivated,
        controller.activationStepsSharing
    );
    router.post(
        '/activation/sharing/agree',
        middleware.isUserActivated,
        controller.activationStepsAgree
    );
    router.get(
        '/activation',
        middleware.isUserActivated,
        controller.activation
    );

    return router;
};