var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    collectionName: 'usersPosts',
    schema: {
        ownerUserId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        content: {
            type: String
        },
        postedAt: {
            type: Date,
            default: Date.now
        },
        postedGeoLocation: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2d'      // create the geospatial index
        }
    }
};
