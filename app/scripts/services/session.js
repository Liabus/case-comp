'use strict';

angular.module('caseCompApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
