var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    alias: 'usersPosts',
    collectionName: 'users_posts',
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
        },
        postedMapView: {
            northEast: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d'      // create the geospatial index
            },
            southWest: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d'      // create the geospatial index
            }
        },
        postedMapViewCenter: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2d'      // create the geospatial index
        },
        postedRegion: {
            type: String
        }
    }
};
