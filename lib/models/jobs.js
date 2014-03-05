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
        candidate: {type: Schema.Types.ObjectId, ref: 'Candidates'},
        datetime: {type: Date, default: Date.now},
        status: {type: String, default: 'Pending'},
        //Full text of the offer:
        offerText: String,
        changeJobStatus: {type: Boolean, default: true}
    }]
});

mongoose.model('Jobs', JobSchema);
