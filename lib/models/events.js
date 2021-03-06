'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var EventSchema = new Schema({
    name: {type: String, required: true},
    university: [{type: String, required: true}],
    address: {type: String, required: true},
    type: {type: String},
    datetime: {type: Date, default: Date.now},

    //Associations:
    attendees: [{type: Schema.Types.ObjectId, ref: 'Candidates', required: true}],
    hosts: [{type: Schema.Types.ObjectId, ref: 'User', required: true}]
});

mongoose.model('Events', EventSchema);
