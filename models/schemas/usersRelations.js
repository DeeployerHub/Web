var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    collectionName: 'usersRelations',
    schema: {
        requestUserId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        responseUserId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }
};
