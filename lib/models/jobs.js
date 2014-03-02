'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var JobSchema = new Schema({
    name: String,
    location: String,
    type: String,
    experience: String,
    status: String,
    salary: Number,
    description: String,
    
    applicants: [{ type: Schema.Types.ObjectId, ref: 'Candidates' }],
    
    offers: [{
        candidate: {type: Schema.Types.ObjectId, ref: 'Candidate', required: true},
        datetime: {type: Date, default: Date.now}
    }]
});

mongoose.model('Jobs', JobSchema);
