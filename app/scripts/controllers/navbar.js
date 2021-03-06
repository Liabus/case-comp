'use strict';

angular.module('caseCompApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth) {

      $scope.user = {};

      $rootScope.$watch('currentUser', function(){
        $scope.user = $rootScope.currentUser;
      });

    $scope.logout = function() {
      Auth.logout().then(function() {
        $location.path('/login');
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path().split('/')[1].toLowerCase();
    };

  });
