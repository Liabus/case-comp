'use strict';

angular.module('caseCompApp')
  .controller('jobsController', function ($scope, Jobs, $location, $routeParams) {
      $scope.edit = false;
      $scope.jobs = [];
      $scope.jobModel = {};
      
      if($routeParams.id){
          $scope.edit = true;
          Jobs.get({id: $routeParams.id}, function(res){
              if(!res){
                  $location.path('/jobs');
                  return;
              }
              $scope.jobModel = res;
          }, function(){
              $location.path('/jobs');
          })
      }
      
      Jobs.list(function(jobs){
          $scope.jobs = jobs.jobs;
      });
      
      $scope.addJobLabel = function(){
          if($scope.edit){
              return 'Edit Job';
          }
          return 'Add Job';
      }
      
      $scope.addJob = function(){
          if($scope.edit){
              //Being a Jabrone.
              //It's the best thing ever! Jabrones for life. I Jabrone, you Jabrone, he/she/it Jabrones. Jabronology, the study of Jabron.
              Jobs.update($scope.jobModel,
                  function(user) {
                      $location.path('/jobs/view/' + $scope.jobModel._id);
                  },
                  function(err) {
                      console.log(err);
                      alert('An error occured while saving.');
                  }
              );
          }else{
            Jobs.save($scope.jobModel,
                function(user) {
                    $location.path('/jobs');
                },
                function(err) {
                    console.log(err);
                    alert('An error occured while saving.');
                }
            );
        }
      };
      
  });