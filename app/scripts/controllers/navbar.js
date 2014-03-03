'use strict';

angular.module('caseCompApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, Applicants) {
      
      
      $scope.applicantCount = 0;
      
      var updateData = function(){
          Applicants.list({}, function(data){
              $scope.applicantCount = (data.candidates || []).length;
          });
      };
      
      updateData();
      
      $scope.$on('ApplicantUpdate', function(){
          updateData();
      });
      
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
