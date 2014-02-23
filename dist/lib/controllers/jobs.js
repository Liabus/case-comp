'use strict';

var mongoose = require('mongoose'),
    Job = mongoose.model('Jobs'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new Job(req.body);
  
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
    
    Job.update({_id: userId}, req.body, function(err){
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
    Job.find(function (err, jobs) {
      if (err) return next(new Error('Failed to load Jobs'));
  
      if (jobs) {
        res.send({jobs: jobs});
      } else {
        res.send(404, 'USER_NOT_FOUND');
      }
    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  Job.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
  
    if (user) {
      res.send(user);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};