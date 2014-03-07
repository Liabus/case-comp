'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    candidates = require('./controllers/candidates'),
    jobs = require('./controllers/jobs'),
    events = require('./controllers/events'),
    applicants = require('./controllers/applicants');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes

  app.post('/api/users', middleware.auth, users.create);

  app.put('/api/users/pass', middleware.auth, users.changePassword);
  app.put('/api/users/name', middleware.auth, users.changeName);

  app.get('/api/users/list', middleware.auth, users.list);
  app.get('/api/users/me', middleware.auth, users.me);
  app.get('/api/users/search', middleware.auth, users.search);
  app.get('/api/users/:id', middleware.auth, users.show);

  app.get('/api/candidates', middleware.auth, candidates.list);
  app.post('/api/candidates', middleware.auth, candidates.create);
  app.put('/api/candidates', middleware.auth, candidates.update);

  app.post('/api/candidates/resume', candidates.upload);

  app.get('/api/candidates/search', middleware.auth, candidates.search);
  app.get('/api/candidates/:id', middleware.auth, candidates.show);
  app.del('/api/candidates/:id', middleware.auth, candidates.delete);

  app.get('/api/applicants', middleware.auth, applicants.list);
  app.post('/api/applicants', middleware.auth, applicants.create);
  app.put('/api/applicants', middleware.auth, applicants.update);
  app.get('/api/applicants/:id', middleware.auth, applicants.show);
  app.del('/api/applicants/:id', middleware.auth, applicants.delete);

  app.get('/api/jobs', middleware.auth, jobs.list);
  app.get('/api/jobs/public', jobs.listPublic);
  app.post('/api/jobs', middleware.auth, jobs.create);
  app.put('/api/jobs', middleware.auth, jobs.update);
  app.get('/api/jobs/applicant', middleware.auth, jobs.applicant);
  app.get('/api/jobs/offer', jobs.viewOffer);
  app.post('/api/jobs/offer', middleware.auth, jobs.offer);
  app.get('/api/jobs/offerStatus', jobs.offerStatus);
  app.get('/api/jobs/:id', middleware.auth, jobs.show);
  app.del('/api/jobs/:id', middleware.auth, jobs.delete);

  app.get('/api/events', middleware.auth, events.list);
  app.post('/api/events', middleware.auth, events.create);
  app.put('/api/events', middleware.auth, events.update);
  app.get('/api/events/:id', middleware.auth, events.show);
  app.del('/api/events/:id', middleware.auth, events.delete);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
