var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    alias: 'usersRelations',
    collectionName: 'users_relations',
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
