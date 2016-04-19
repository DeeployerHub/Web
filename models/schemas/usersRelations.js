var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'usersRelations',
    schema: {
        requestUserId: {
            type: Schema.Types.ObjectId
        },
        responseUserId: {
            type: Schema.Types.ObjectId
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }
};
