/**
 * Created by Wilco on 05/12/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playerModel = new Schema({
    name: {
        type: String
    },
    country: {
        type: String
    },
    gender: {
        type: String
    }
});

module.exports = mongoose.model('player', playerModel);