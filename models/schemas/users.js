var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    collectionName: 'users',
    schema: {
        username: {
            type: String,
            trim: true
        },
        avatar: {
            type: String,
            trim: true
        },
        coverPicture: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            index: {
                unique: true
            }
        },
        activated: {
            type: Boolean,
            default: false
        },
        registerAt: {
            type: Date,
            default: Date.now
        },
        profile: [new Schema({
            gender: String,
            firstname: String,
            lastname: String,
            country: String,
            phone: String,
            geoLocation: String,
            registerAt: {
                type: Date,
                default: Date.now
            }
        })],
        points: Number,
        pointsHistory: [new Schema({
            occuredAt: {
                type: Date,
                default: Date.now
            },
            points: Number,
            pointBeforeAction: Number,
            pointAfterAction: Number,
            type: String,
            reason: String,
            description: String
        })]
    }
};
