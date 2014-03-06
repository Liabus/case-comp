'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Events'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {

  //Better associations:
  for(var i = 0; i < (req.body.hosts || []).length; i++){
    req.body.hosts[i] = mongoose.Types.ObjectId(req.body.hosts[i].id || req.body.hosts[i]._id);
  };

  for(var i = 0; i < (req.body.attendees || []).length; i++){
    req.body.attendees[i] = mongoose.Types.ObjectId(req.body.attendees[i].id || req.body.attendees[i]._id);
  };

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

    console.log(req.body);

    //Prevent de-association bug:
    //delete req.body.attendees;

    for(var i = 0; i < (req.body.hosts || []).length; i++){
      req.body.hosts[i] = mongoose.Types.ObjectId(req.body.hosts[i].id || req.body.hosts[i]._id);
    };

    for(var i = 0; i < (req.body.attendees || []).length; i++){
      req.body.attendees[i] = mongoose.Types.ObjectId(req.body.attendees[i].id || req.body.attendees[i]._id);
    };

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
    Event.find().sort('-_id').exec(function (err, jobs) {
      if (err) return next(new Error('Failed to load Jobs'));

      if (jobs) {
        res.send({events: jobs});
      } else {
        res.send(404, 'USER_NOT_FOUND');
      }
    });
};


/**
 *  delete specified events
 */
exports.delete = function (req, res, next) {
    //var userId = req.param('id');
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.param('id');

  Event.findById(userId).populate('hosts').populate('attendees').exec(function (err, user) {
    if (err) return next(new Error('Failed to load User'));

    if (user) {
      res.send(user);
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};
