'use strict';

var mongoose = require('mongoose'),
    Candidate = mongoose.model('Candidates'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new Candidate(req.body);
  newUser.provider = 'local';

  newUser.applicant = true;

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

    Candidate.update({_id: userId}, req.body, {upsert: true}, function(err){
        if (err) {
          res.send(500, err);
        } else {
          res.send(200);
        }
    });
};

/**
 * List Applicants
 */
exports.list = function (req, res, next) {
    Candidate.find({applicant: true}).sort('-_id').exec(function (err, users) {
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

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.param('id');

  if(userId === 'interview'){
      Candidate.findById(req.param('_id'), function (err, user) {
        if (err) return next(new Error('Failed to load User'));
        delete req.params._id;
        user.interview.push(req.query);
        user.save(function(a, b, c){
            res.send('yep');
        });
      });
      return;
  }

  Candidate.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));

    if (user) {
      res.send(user);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};
