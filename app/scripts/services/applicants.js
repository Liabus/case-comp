'use strict';

angular.module('caseCompApp')
  .factory('Applicants', function ($resource) {
    return $resource('/api/applicants/:id', {
      id: '@id'
    }, { //parameters default
        list: {
            method: 'GET',
            params: {
                
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
        },
        interview: {
            method: 'GET',
            params: {
                'id': 'interview'
            }
        }
	  });
  });
