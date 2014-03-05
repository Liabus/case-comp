'use strict';

var mongoose = require('mongoose'),
    Job = mongoose.model('Jobs'),
    passport = require('passport'),
    nodemailer = require('nodemailer');


var mailServer = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "form@liabus.com",
        pass: "Likeabus!"
    }
});

var mail = function(to, subject, html){
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "RecruitMe <form@liabus.com>", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html // html body
  }

  // send mail with defined transport object
  mailServer.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }
  });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  if(req.body.visibility){
    req.body.visible = (req.body.visibility === 'Public');
  }

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

    if(req.body.visibility){
      req.body.visible = (req.body.visibility === 'Public');
    }

    Job.update({_id: userId}, req.body, function(err){
        if (err) {
          res.send(500, err);
        } else {
          res.send(200);
        }
    });
};

exports.offer = function(req, res, next){
  //POST request:
  var body = req.body;

  Job.findById(body.job).exec(function (err, job) {
    if (err || !job) return next(new Error('Failed to load Job'));

    body.candidate = mongoose.Types.ObjectId(body.candidate);

    if(body.changeJobStatus){
      job.status = 'Offered';
    }

    if(body.autoReject){
      job.applicants.forEach(function(app){
        app.status = '';
        if(body.emailRejected){
          var can = app.candidate;
          if(can.email && (can._id + '') !== (body.candidate + '')){
            mail(can.email, body.rejectedSubject || "Your Application At Blackwood Consulting", body.rejectedEmailText);
          }
        }
      });
    }

    job.offers.push(body);

    job.save(function(err, doc){
      if(err){
          res.send(404, 'JOB_NOT_FOUND');
      }else{

        console.log(doc);

        if(body.emailToCandidate){
          body.offerText += '<p>To view, accept, or decline this offer, <a href="http://blackwood.liabus.com/offers/v/' + doc._id + '">click here.</a></p> <br /><br /><br />';
          mail(body.candidateEmail, body.offerSubject || "Offer From Blackwood Consulting", body.offerText);
        }

          res.send({'ok': true});
      }
    });

  });

};

exports.applicant = function (req, res, next) {
    var body = req.query;

    Job.findById(body.job, function (err, job) {
            if (err) return next(new Error('Failed to load Job'));
            body.candidate = mongoose.Types.ObjectId(body.candidate);

            if(body._id){
                    var uid = body._id;
                    delete body._id;
                    Job.update({_id: body.job, 'applicants._id': uid}, {$set: {'applicants.$.status': body.status}}, function(err, b, c){
                      if(err){
                          res.send(404, 'JOB_NOT_FOUND');
                      }else{
                          res.send({'ok': true});
                      }
                    });
            }else{
              delete body.job;
                    var exists = false;
                    job.applicants.forEach(function(app){
                      //Can't do direct comparison, so we convert to strings:
                      if((app.candidate + '') === (body.candidate + '')){
                        exists = true;
                        return true;
                      }
                    });

                    if(exists){
                      res.send({'ok': 'mildly'});
                    }else{
                      job.applicants.push(body);
                      job.save(function(err, b, c){
                          if(err){
                              res.send(404, 'JOB_NOT_FOUND');
                          }else{
                              res.send({'ok': true});
                          }
                      });
                    }
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

exports.delete = function (req, res, next) {
    var jobId = req.param('id');

    Job.findByIdAndRemove(jobId, function (err, job) {
      if (err) return next(new Error('Failed to delete Job'));

      if (job) {
        res.send(job);
      } else {
        res.send(404, 'JOB_NOT_FOUND');
      }
    });
};

/**
 *  Get profile of specified job
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  Job.findById(userId).populate('applicants.candidate').populate('offers.candidate').exec(function (err, user) {
    if (err) return next(new Error('Failed to load User'));

    if (user) {
      res.send(user);
    } else {
      res.send(404, 'JOB_NOT_FOUND');
    }
  });
};


exports.viewOffer = function (req, res, next) {
  var offerId = req.query.offer;

  Job.find({'offers._id': offerId}, {'offers.$': 1}).exec(function (err, offer) {
    if (err) return next(new Error('Failed to load Offer'));

    if (offer) {
      res.send({offer: offer[0]});
    } else {
      res.send(404, 'OFFER_NOT_FOUND');
    }
  });
};

exports.offerStatus = function(req, res, next){
  var offerId = req.query.offer;
  Job.update({'offers._id': offerId}, {'offers.$.status': req.query.status || 'Viewed'}).exec(function (err, offer) {

    if (err) return next(new Error('Failed to load Offer'));

      res.send({ok: true});
  });
};
