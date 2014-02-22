'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var EventSchema = new Schema({
    name: String,
    info: String,
    location: String,
    type: String,
    datetime: Date,
    
    //Associations:
    //hosts: Users,
    //attendees: Candidates
});

mongoose.model('Events', EventSchema);
