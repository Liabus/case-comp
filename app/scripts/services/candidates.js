'use strict';

angular.module('caseCompApp')
  .factory('Candidates', function ($resource) {
    return $resource('/api/candidates/:id', {
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
                id:'me'
            }
        }
	  });
  });
