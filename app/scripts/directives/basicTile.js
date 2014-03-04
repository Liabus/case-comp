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
          'details': '=',
          'edit': '=',
          'edited': '&'
      },
      replace: true,
      templateUrl: 'partials/basicTile.html',
      link: function(scope, elem, attrs, ngModel) {

          //Big plus icon:
          if(attrs.mode && attrs.mode === 'add'){
              elem.addClass('add');
              elem.html('<span class="fa fa-plus"></span>');
          }

          var linker = {
              'event': 'calendar',
              'job': 'suitcase',
              'candidate': 'user'
          };

          scope.deArray = function(det){
              if(_.isArray(det)){
                  return det.join(', ');
              }
              return det;
          }

          scope.editClicked = function($event){
            $event.preventDefault();
            $event.stopPropagation();

            scope.edited();
          };

          scope.$watch('icon', function(val, e, r, b){
              scope.picon = 'fa-' + linker[scope.icon];
              //scope.$apply();
          });
      }
    };
  });
