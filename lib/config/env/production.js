'use strict';

var mongourl = 'mongodb://casecomp:casecomp@ds033579.mongolab.com:33579/casecomp';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/fullstack'
  }
};