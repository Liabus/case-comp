'use strict';

angular.module('caseCompApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth) {
      
      $scope.user = $rootScope.currentUser;
      
    $scope.logout = function() {
        console.log('logging out');
      Auth.logout().then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path().split('/')[1].toLowerCase();
    };
    
  });
