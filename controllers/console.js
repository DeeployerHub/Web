module.exports = ConsoleController;

var userRepos = getRepos('users')();

/**
 *  ConsoleController
 *
 * @returns {ConsoleController}
 * @constructor
 */
function ConsoleController () {
    'use strict';

    if (!(this instanceof ConsoleController)) {
        return new ConsoleController();
    }
}

/**
 * @param req
 * @param res
 */
ConsoleController.prototype.console = function (req, res) {
    'use strict';

    userRepos.getUserInfo(req.user.email).then(function (userInfo) {
        res.render('console/pages/console', {
            socketRegion: 'console',
            user: userInfo
        });
    }, function (err) {
        console.error(err);

        errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
    });
};
