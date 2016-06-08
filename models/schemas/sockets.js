var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = {
    collectionName: 'sockets',
    schema: {
        socketId: {
            type: String
        },
        region: {
            type: String
        },
        geoLocation: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2d'      // create the geospatial index
        },
        mapViewCenter: {
            type: [Number],  // [<longitude>, <latitude>]
            index: '2d'      // create the geospatial index
        },
        mapViewBorder: {
            northEast: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d'      // create the geospatial index
            },
            southWest: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d'      // create the geospatial index
            }
        },
        userId: {
            type: Schema.ObjectId,
            ref: 'users'
        },
        pid: {
            type: Number
        },
        connectedAt: {
            type: Date,
            default: Date.now
        }
    }
};
