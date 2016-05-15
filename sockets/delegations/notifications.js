module.exports = Notifications;
/**
 * handle the socket.io's notifications
 *
 * @param io
 * @param socket
 *
 * @returns {Notifications}
 * @constructor
 */
function Notifications(io, socket) {
    'use strict';

    if (!(this instanceof Notifications)) {
        return new Notifications(io, socket);
    }

    // socket.emit('notify', {
    //     text: 'new notification'
    // });
}
