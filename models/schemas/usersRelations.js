var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'usersRelations',
    schema: {
        requestUserId: {
            Types: Schema.Types.ObjectId
        },
        responseUserId: {
            Types: Schema.Types.ObjectId
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    },
    conditions: {
        _id: false
    }
};
