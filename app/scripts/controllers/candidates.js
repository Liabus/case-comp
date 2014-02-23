'use strict';

angular.module('caseCompApp')
  .controller('candidatesController', function ($scope, Candidates, $location, $routeParams) {
      $scope.edit = false;
      $scope.candidates = [];
      $scope.um = {};
      $scope.udm = {};
      
      if($routeParams.id){
          $scope.edit = true;
          Candidates.get({id: $routeParams.id}, function(res){
              $scope.um = res;
          }, function(){
              $location.path('/candidates');
          })
      }
      
      Candidates.list(function(jobs){
          $scope.candidates = jobs.candidates;
      });
      
      $scope.addCandidatesLabel = function(){
          if($scope.edit){
              return 'Edit Candidate';
          }
          return 'Add Candidate';
      }
      
      $scope.addInterview = function(){
          $scope.udm._id = $scope.um._id;
          Candidates.interview($scope.udm, function(){
              $location.path('/candidates/view/' + $scope.um._id);
          });
      }
      
      $scope.addCandidate = function(){
          if($scope.edit){
              Candidates.update($scope.um,
                  function(user) {
                      $location.path('/candidates/view/' + $scope.um._id);
                  },
                  function(err) {
                      console.log(err);
                      alert('An error occured while saving.');
                  }
              );
          }else{
            Candidates.save($scope.um,
                function(user) {
                    $location.path('/candidates');
                },
                function(err) {
                    console.log(err);
                    alert('An error occured while saving.');
                }
            );
        }
      };
      
  });