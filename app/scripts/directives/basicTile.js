'use strict';

angular.module('caseCompApp')

  /**
   * Removes server error when user updates input
   */
  .directive('basicTile', function () {
    return {
      restrict: 'AE',
      scope: {
          'icon': '=',
          'header': '=',
          'details': '='
      },
      replace: true,
      templateUrl: 'partials/basicTile.html',
      link: function(scope, elem, attrs, ngModel) {
          
          //Big plus icon:
          if(attrs.mode && attrs.mode === 'add'){
              elem.addClass('add');
              elem.html('<span class="glyphicon glyphicon-plus"></span>');
          }
          
          var linker = {
              'event': 'calendar',
              'job': 'suitcase',
              'candidate': 'user'
          };
          
          scope.$watch('icon', function(val, e, r, b){
              scope.picon = 'fa-' + linker[scope.icon];
              //scope.$apply();
          });
      }
    };
  });