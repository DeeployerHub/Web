var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    collectionName: 'nodesPool',
    schema: {
        pid: {
            type: Number
        },
        execPath: {
            type: String,
            trim: true
        },
        platform: {
            type: String,
            trim: true
        },
        argv: {
            type: Schema.Types.Object
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }
};
