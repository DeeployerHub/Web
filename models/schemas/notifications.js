var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'notifications',
    schema: {
        ownerId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        requestUserId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        isRead: {
            type: Boolean,
            default: false
        },
        type: {
            type: String
        },
        attributes: {
            type: Schema.Types.Mixed
        },
        registerAt: {
            type: Date,
            default: Date.now
        }
    }
};
