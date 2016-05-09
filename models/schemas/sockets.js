var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'sockets',
    schema: {
        socketId: {
            type: String
        },
        userId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        connectedAt: {
            type: Date,
            default: Date.now
        }
    }
};
