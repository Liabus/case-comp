'use strict';

var mongourl = '';
mongourl = 'mongodb://casecomp:casecomp@ds033579.mongolab.com:33579/casecomp';

module.exports = {
  env: 'development',
  mongo: {
    uri: mongourl || 'mongodb://localhost/fullstack-dev'
  }
};
