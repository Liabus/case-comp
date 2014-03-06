'use strict';

var mongourl = 'mongodb://casecomp:casecomp@ds033579.mongolab.com:33579/casecomp';
//var mongourl = '';

module.exports = {
  env: 'development',
  mongo: {
    uri: mongourl || 'mongodb://localhost/fullstack-dev'
  }
};
