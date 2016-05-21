module.exports = Actions;

var uuid    = require('node-uuid');
var Promise = require('promise');

/**
 * sockets module actions
 * 
 * @returns {Actions}
 * @constructor
 */
function Actions(io) {
    'use strict';

    if (!(this instanceof Actions)) {
        return new Actions(io);
    }

    this.io = io;
}

/**
 * initialize the actions
 * @param action
 * @returns {*}
 */
Actions.prototype.init = function (action) {
    'use strict';

    /**
     * join the socket to a room
     *
     * @param socket
     * @param roomName
     */
    this.joinToRoom = function (socket, roomName) {
        if (socket) {
            // join to the temp room
            socket.join(roomName);
        }
    };

    /**
     * leave the sockets from room
     * @param sockets
     * @param roomName
     */
    this.leaveFromRoom = function (roomName) {
        var sockets = this.io.sockets;
        var socketsInRoom = sockets.in(roomName).connected;

        for (var socketId in socketsInRoom) {
            socketsInRoom[socketId].leave(roomName);
        }
    };

    return require('./' + action)(this);
};




/**
 * broadcast a message to group of sockets
 *
 * @param socketsList
 * @param action
 * @param data
 *
 * @returns {*}
 */
Actions.prototype.broadcast = function (socketsList, action, data) {
    'use strict';

    var self = this;

    return new Promise(function (resolve, reject) {
        if ('object' !== typeof socketsList) {
            reject(new Error('socket list is not an object'));
        }

        var itemsProcessed = 0;
        var sockets        = self.io.sockets;
        var roomName       = uuid.v1();

        socketsList.forEach(function (socket) {
            // check if the socket is still alive
            var connectedSocket = sockets.connected[socket._id] || false;
            self.joinToRoom(connectedSocket, roomName);

            // check if sockets are in the room
            if (++itemsProcessed >= socketsList.length) {
                // sockets join the room succesfully, broadcast the message
                connectedSocket.to(roomName).emit(action, data);
                self.leaveFromRoom(roomName);

                resolve();
            }
        });
    });
};
