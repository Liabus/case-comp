'use strict';

angular.module('caseCompApp')
  .controller('candidatesController', function ($scope, Candidates, $location, $routeParams, $modal) {
      $scope.edit = false;
      $scope.candidates = [];
      $scope.um = {};
      $scope.udm = {};
      
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
              Candidates.get({id: $routeParams.id}, function(res){
                  NProgress.done();
                  $scope.um = res;
              }, function(){
                  NProgress.done();
                  $location.path('/candidates');
              });
          }else{
              Candidates.list(function(jobs){
                  NProgress.done();
                  //Add name field for searching:
                  _.forEach(jobs.candidates, function(el){
                      el.name = el.firstName + ' ' + el.lastName;
                  });
                  $scope.candidates = jobs.candidates;
              });
          }
      }
      
      $scope.deArray = function(det, first){
          if(_.isArray(det)){
              if(first){
                  return det[0];
              }
              return det.join(', ');
          }
          return det;
      }
      
      updateData();
      
      $scope.pickRelevant = function(candidate){
          var sm = $scope.sortMode.toLowerCase();
          if(sm === 'name' || sm === 'firstname') sm = '';
          
          var rel = sm || (candidate.matched || '').toLowerCase() || 'name';
          
          if(rel === 'name' || rel === 'firstname'){
              return candidate.university;
          }else if(rel === 'gpa'){
              return (candidate.GPA + ' GPA') || candidate.university || '';
          }else{
              return candidate[rel] || candidate.university || '';
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
      
      $scope.addClicked = function(){
          NProgress.start();
          var modalInstance = $modal.open({
              templateUrl: 'partials/addCandidate.html',
              controller: 'ModalController'
          });
          
          modalInstance.result.then(function (selectedItem) {
            updateData();
          }, function () {
              //$log.info('Modal dismissed at: ' + new Date());
          });
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