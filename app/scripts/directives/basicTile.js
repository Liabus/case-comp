'use strict';

angular.module('caseCompApp')

  /**
   * Removes server error when user updates input
   */
  .directive('basicTile', function () {
    return {
      restrict: 'AE',
      scope: {
          type: '@',
          text: '@'
      },
      replace: true,
      template: '<div class="tile"><div class="event-icon"><i class="fa" ng-class="linker()"></i> {{text}} </div></div>',
      link: function(scope, element, attrs, ngModel) {
          var linker = {
              'event': 'calendar',
              'job': 'suitcase',
              'candidate': 'user'
          };
          scope.linker = function(){
              return 'fa-' + linker[scope.type];
          }
          scope.mainclass = function(){
              return scope.type + '-icon';
          }
      }
    };
  });