'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validate'),
    uuid = require('uuid');
    
/**
 * Thing Schema
 */
var CandidateSchema = new Schema({
    
    uuid: {type: String, default: uuid.v4, unique: true},
    
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String,
        required: true,
        validate: [validate.email, 'invalid email address']
    },
    university: [{type: String, required: true}],
    major: [{type: String, required: true}],
    minor: [{type: String, required: false}],
    GPA: {type: Number, required: true},
    address: {type: String, required: false},
    phone: {type: String, required: true},
    
    applicant: {type: Boolean, default: false},
    
    experience: String,
    skills: String,
    interests: String,
    
    interview: [{
        datetime: {type: Date, default: Date.now, required: true},
        interviewer: { type: Schema.Types.ObjectId, ref: 'User', required: false},
        type: {type: String, required: true},
        notes: {type: String}
    }]
});

mongoose.model('Candidates', CandidateSchema);
