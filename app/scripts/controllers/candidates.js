'use strict';

angular.module('caseCompApp')
  .controller('candidatesController', function ($scope, Candidates, $location) {
      $scope.candidates = [];
      Candidates.list(function(candidates, b, c){
          $scope.candidates = candidates;
      });
  });