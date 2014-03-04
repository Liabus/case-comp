'use strict';

angular.module('caseCompApp')
  .factory('Jobs', function ($resource) {
    return $resource('/api/jobs/:id', {
      id: '@id'
    }, { //parameters default
        list: {
            method: 'GET',
            params: {

            }
        },

        applicant: {
            method: 'GET',
            params: {
              id: 'applicant'
            }
        },

        update: {
            method: 'PUT',
            params: {}
        },
        get: {
            method: 'GET',
            params: {
            }
        }
	  });
  });
