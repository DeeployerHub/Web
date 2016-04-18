var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'usersRelations',
    schema: {
        request: {
            Types: Schema.Types.ObjectId
        },
        response: {
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
