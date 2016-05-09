module.exports = Connection;
/**
 * handle the socket.io connection
 * @param base
 * @returns {Connection}
 * @constructor
 */
function Connection (base) {
    'use strict';

    if (!(this instanceof Connection)) {
        return new Connection(base);
    }

    var socketRepo = getRepos('sockets')();

    base.io.on('connection', function (socket) {
        socketRepo.connect(socket.session.user._id, socket.id).then(function () {
            socket.on('disconnect', function () {
                socketRepo.disconnect(socket.id).then(null, function (err) {
                    console.error(err);
                });
            });
        }, function (err) {
            console.error(err);
        });
    });
}
