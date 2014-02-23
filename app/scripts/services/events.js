'use strict';

angular.module('caseCompApp')
  .factory('Events', function ($resource) {
    return $resource('/api/events/:id', {
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
        attendee: {
            method: 'GET',
            params: {
                'id': 'attendee'
            }
        }
	  });
  });