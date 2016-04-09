'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('profile/main.js');

    router.get('/', getMiddleware('account.signInCheck'), controller.profile);

    router.post(
        '/avatar-upload',
        getMiddleware('account.signInCheck'),
        controller.profileAvatarUpload
    );

    return router;
};
