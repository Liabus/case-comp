'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Events'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new Event(req.body);
  
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
    
    Event.update({_id: userId}, req.body, function(err){
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
    Event.find(function (err, jobs) {
      if (err) return next(new Error('Failed to load Jobs'));
  
      if (jobs) {
        res.send({events: jobs});
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
  
  if(userId === 'attendee'){
      Event.findById(req.param('_id'), function (err, user) {
        if (err) return next(new Error('Failed to load Event'));
        delete req.params._id;
        user.attendees.push(req.query);
        user.save(function(a, b, c){
            console.log(a, b, c)
            res.send('yep');
        });
      });
      return;
  }

  Event.findById(userId, function (err, user) {
    if (err) return next(new Error('Failed to load User'));
  
    if (user) {
      res.send(user);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};