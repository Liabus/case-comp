'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
    name: {type: String, required: true},
    location: {type: String, required: true},
    type: {type: String, required: true},
    experience: {type: String, required: true},
    status: {type: String, required: true},

    salary: Number,

    description: {type: String, default: ''},

    visible: {type: Boolean, default: true},

    applicants: [{
        //enum: ['Pending', 'Rejected', 'Offered', 'Accepted', 'Interviewing', 'Other']
        status: {type: String, default: 'Pending'},
        candidate: {type: Schema.Types.ObjectId, ref: 'Candidates'}
    }],

    offers: [{
        candidate: {type: Schema.Types.ObjectId, ref: 'Candidate', required: true},
        datetime: {type: Date, default: Date.now},
        //Full text of the offer:
        text: String
    }]
});

mongoose.model('Jobs', JobSchema);
