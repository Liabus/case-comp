'use strict';

var mongoose = require('mongoose'),
    Candidate = mongoose.model('Candidates'),
    Job = mongoose.model('Jobs'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new Candidate(req.body);
  newUser.provider = 'local';

  newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    }else{
        res.json({ok: true});
    }
  });
};

/**
 * Update user
 */
exports.update = function (req, res, next) {
    var userId = req.body._id;

    delete req.body._id;

    //Prevent de-assiciation:
    delete req.body.interview;

    Candidate.update({_id: userId}, req.body, {upsert: true}, function(err){
        if (err) {
          res.send(500, err);
        } else {
          res.send(200);
        }
    });
};

/**
 * List Users
 */
exports.list = function (req, res, next) {
    Candidate.find({applicant: false}).sort('-_id').exec(function (err, users) {
      if (err) return next(new Error('Failed to load Candidates'));

      if (users) {
        res.send({candidates: users});
      } else {
        res.send(404, 'USER_NOT_FOUND');
      }
    });
};

exports.delete = function (req, res, next) {
  var userId = req.param('id');

  Candidate.findByIdAndRemove(userId, function (err, user) {
    if (err) return next(new Error('Failed to delete Candidate'));

    if (user) {
      res.send(user);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};

exports.search = function (req, res, next) {
  var name = req.query.q;

  var fnQuery = new RegExp('.*' + name.split(' ')[0] + '.*', "gi");
  var lnQuery = new RegExp('.*' + name.split(' ')[1] + '.*', "gi");
  var query = new RegExp('.*' + name + '.*', "gi");

  Candidate.find({applicant: false}).or([{firstName: fnQuery}, {lastName: lnQuery}, {location: query}, {university: query}, {major: query}, {minor: query}]).exec(function (err, users) {
    if (err) return next(new Error('Failed to load Candidates'));
      res.send({ candidates: users });

  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.param('id');

  if(userId === 'interview'){
      Candidate.findById(req.param('_id'), function (err, user) {
        if (err) return next(new Error('Failed to load Candidate'));
        delete req.query._id;

        req.query.datetime = JSON.parse(req.query.datetime);
        req.query.interviewer = JSON.parse(req.query.interviewer);
        req.query.interviewer = mongoose.Types.ObjectId(req.query.interviewer.id);

        user.interview.push(req.query);
        user.save(function(err, b, c){
            if(err){
                res.send(404, 'USER_NOT_FOUND');
            }else{
                res.send('yep');
            }
        });
      });
      return;
  }

  Candidate.findById(userId).populate('interview.interviewer').exec(function (err, user) {
    if (err) return next(new Error('Failed to load User'));

    if (user) {
      Job.find({'applicants.candidate': userId}, function(err, jobs){
        user = user.toObject();
        console.log(user, jobs);
        user.jobs = jobs || [];
        res.send(user);
      });
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};
