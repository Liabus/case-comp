'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var EventSchema = new Schema({
    name: {type: String, required: true},
    info: {type: String, required: true},
    location: {type: String, required: true},
    type: {type: String, required: true},
    datetime: {type: Date, default: Date.now},
    
    //Associations:
    hosts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attendees: [{ type: Schema.Types.ObjectId, ref: 'Candidates' }]
});

mongoose.model('Events', EventSchema);
