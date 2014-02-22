'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

var port = process.env.PORT || 3000;

module.exports = {
  root: rootPath,
  port: port,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};
