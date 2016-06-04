var Notifications = require('./notifications');
var Locations     = require('./locations');
module.exports    = Delegations;
/**
 * handle the socket.io's Delegations
 *
 * @returns {Delegations}
 * @constructor
 */
function Delegations (io, socket) {
    'use strict';

    if (!(this instanceof Delegations)) {
        return new Delegations();
    }

    new Notifications(io, socket);
    new Locations(io, socket);
}
