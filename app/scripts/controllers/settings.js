'use strict';

angular.module('caseCompApp')
  .controller('SettingsCtrl', function ($scope, $routeParams, $rootScope, User, Auth) {
    $scope.errors = {};
    $scope.Nerrors = {};

    $scope.user = {};

    $scope.user.newName = $rootScope.currentUser.name;

    //Direct to a page:
    if($routeParams.page){
      $scope.userSettingsActive = true;
    }

    $scope.users = [];

    User.get({id: 'list'}, function(res){
      $scope.users = res.users;
    });


    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};

    $scope.changeName = function(form) {
      $scope.Nsubmitted = true;

      var nname = $scope.user.newName;

      if(form.$valid) {
        Auth.changeName(nname)
        .then( function() {
          $scope.Nmessage = 'Name successfully changed.';
          $rootScope.currentUser.name = nname;
        })
        .catch( function() {
          form.name.$setValidity('mongoose', false);
          $scope.Nerrors.other = 'Name rejected by server.';
        });
      }
    };
  });
