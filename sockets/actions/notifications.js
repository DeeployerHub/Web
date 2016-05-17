var notifications = module.exports = Notifications;
/**
 * handle the socket.io's notifications actions
 *
 * @param io
 *
 * @returns {Notifications}
 * @constructor
 */
function Notifications(io) {
    'use strict';

    if (!(this instanceof Notifications)) {
        return new Notifications(io);
    }

    this.io = io;
}

Notifications.prototype.messageAudience = function () {

};
