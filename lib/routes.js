'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    candidates = require('./controllers/candidates'),
    jobs = require('./controllers/jobs'),
    events = require('./controllers/events');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  app.post('/api/users', middleware.auth, users.create);
  app.put('/api/users', middleware.auth, users.changePassword);
  app.get('/api/users/me', middleware.auth, users.me);
  app.get('/api/users/:id', middleware.auth, users.show);
  
  app.get('/api/candidates', middleware.auth, candidates.list);
  app.post('/api/candidates', middleware.auth, candidates.create);
  app.put('/api/candidates', middleware.auth, candidates.update);
  app.get('/api/candidates/:id', middleware.auth, candidates.show);
  app.del('/api/candidates/:id', middleware.auth, candidates.delete);
  
  app.get('/api/jobs', middleware.auth, jobs.list);
  app.post('/api/jobs', middleware.auth, jobs.create);
  app.put('/api/jobs', middleware.auth, jobs.update);
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