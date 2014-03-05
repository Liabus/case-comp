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

        offer: {
          method: 'POST',
          params: {
            id: 'offer'
          }
        },

        viewOffer: {
          method: 'GET',
          params: {
            id: 'offer'
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
