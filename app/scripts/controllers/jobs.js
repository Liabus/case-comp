'use strict';

angular.module('caseCompApp')
  .controller('jobsController', function ($scope, Jobs, $location, $routeParams) {
      $scope.edit = false;
      $scope.jobs = [];
      $scope.jobModel = {};
      
      
      
      
      
      
      $scope.sortMode = 'name';
      $scope.sortString = 'Name';
      //Does the opposite of what it sounds like:
      $scope.sortDesc = false;
      $scope.sortBackwards = false;
      
      $scope.searchMode = 'all';
      $scope.searchString = 'All';
      
      if($routeParams.id){
          $scope.edit = true;
      }
      
      var updateData = function(){
          NProgress.start();
          if($scope.edit){
              Jobs.get({id: $routeParams.id}, function(res){
                  NProgress.done();
                  $scope.um = res;
              }, function(){
                  NProgress.done();
                  $location.path('/jobs');
              });
          }else{
              Jobs.list(function(jobs){
                  NProgress.done();
                  $scope.jobs = jobs.jobs;
              });
          }
      }
      
      updateData();
      
      $scope.deArray = function(det, first){
          if(_.isArray(det)){
              if(first){
                  return det[0];
              }
              return det.join(', ');
          }
          return det;
      }
      
      $scope.pickRelevant = function(job){
          var sm = $scope.sortMode.toLowerCase();
          if(sm === 'name') sm = '';
          
          var rel = sm || (job.matched || '').toLowerCase() || 'name';
          
          if(rel === 'name'){
              return job.location;
          }else{
              return job[rel] || job.location || '';
          }
      }
      
      $scope.swapSortDirection = function(){
          $scope.sortDesc = !$scope.sortDesc;
      }
      $scope.setSort = function(mode, str, force){
          $scope.sortMode = mode;
          $scope.sortString = str;
          $scope.sortBackwards = force || false;
      }
      $scope.getSortDesc = function(){
          if($scope.sortBackwards){
              return !$scope.sortDesc;
          }
          return $scope.sortDesc;
      }
      
      $scope.clearSearch = function(){
          $scope.searchMode = 'all';
          $scope.searchString = 'All';
          $scope.search = '';
      }
      $scope.setSearch = function(mode, str){
          $scope.searchMode = mode;
          $scope.searchString = str;
      }
      
      $scope.deleteClicked = function(){
          var modalInstance = $modal.open({
            templateUrl: 'partials/deleteModal.html',
            controller: 'DeleteModalController',
            resolve: {
              type: function () {
                  return 'Job';
              },
              name: function () {
                  return $scope.jobModel.name;
              }
            }
          });

          modalInstance.result.then(function (resAction) {
              if(resAction === 'yes'){
                  NProgress.start();
                  Jobs.delete({id: $routeParams.id}, function(res){
                      NProgress.done();
                      $location.path('/jobs');
                  }, function(err){
                      console.log(err);
                      NProgress.done();
                      alert('An unknown error occured while deleting the job.');
                  });
              }
          }, function () {
              //Nope.
          });
      }
      
  });