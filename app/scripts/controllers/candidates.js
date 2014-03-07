'use strict';

angular.module('caseCompApp')
  .controller('candidatesController', function ($scope, Candidates, Applicants, Jobs, $location, $routeParams, $modal) {
      $scope.edit = false;
      $scope.candidates = [];
      $scope.um = {};
      $scope.udm = {};

      $scope.applicants = ($location.path().split('/')[1] === 'applicants');

      var dataSet = Candidates;
      if($scope.applicants){
          dataSet = Applicants;
      }


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

      $scope.addToJob = function(){
        NProgress.start();

        var modalInstance = $modal.open({
            templateUrl: 'partials/addCandidateJob.html',
            controller: 'ModalController',
            resolve: {
                'ForcedData': function(){
                    return {
                      title: 'Job to Candidate',
                      mode: 'JC',
                      noedit: true,
                      edit: false,
                      defaultData: {
                        status: 'Pending'
                      },
                      upload: function(model, callback){
                        var modelClone = _.cloneDeep(model);
                        modelClone.candidate = $scope.um._id;
                        modelClone.job = model.job._id;
                        Jobs.applicant(modelClone, function(a, b){
                          callback();
                        });
                      }
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
          updateData();
        }, function () {
            //console.log('Modal dismissed at: ' + new Date());
        });
      };

      var updateData = function(){
          NProgress.start();
          if($scope.edit){
              dataSet.get({id: $routeParams.id}, function(res){
                  NProgress.done();

                  if(res.applicant && !$scope.applicants){
                    $location.path('/applicants/view/' + res._id);
                  }else if(!res.applicant && $scope.applicants){
                    $location.path('/candidates/view/' + res._id);
                  }else{
                    $scope.um = res;
                  }

              }, function(){
                  NProgress.done();
                  $location.path('/candidates');
              });
          }else{
              dataSet.list(function(jobs){
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

      $scope.deleteClicked = function(){
          var modalInstance = $modal.open({
            templateUrl: 'partials/deleteModal.html',
            controller: 'DeleteModalController',
            resolve: {
              type: function () {
                  return 'Candidate';
              },
              name: function () {
                  return $scope.um.firstName + ' ' + $scope.um.lastName;
              }
            }
          });

          modalInstance.result.then(function (resAction) {
              if(resAction === 'yes'){
                  NProgress.start();
                  dataSet.delete({id: $routeParams.id}, function(res){
                      NProgress.done();
                      $location.path('/candidates');
                  }, function(err){
                      console.log(err);
                      NProgress.done();
                      alert('An unknown error occured while deleting the candidate.');
                  });
              }
          }, function () {
              //Nope.
          });
      }

      $scope.upgradeCandidate = function(){
          if($scope.applicants){
              NProgress.start();
              $scope.um.applicant = false;
              dataSet.update($scope.um, function(dat){
                  NProgress.done();
                  if(dat[0] === 'O'){
                      $location.path('/candidates');
                  }else{
                      alert('An error occured while upgrading applicant.');
                  }
              });
          }
      }

      $scope.downgradeCandidate = function(){
          if(!$scope.applicants){
              NProgress.start();
              $scope.um.applicant = true;
              dataSet.update($scope.um, function(dat){
                  NProgress.done();
                  if(dat[0] === 'O'){
                      $location.path('/applicants');
                  }else{
                      alert('An error occured while upgrading applicant.');
                  }
              });
          }
      }

      $scope.formatPhone = function(input){
          if(input){
              return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
          }else{
              return '';
          }
      }

      $scope.addClicked = function(){
          NProgress.start();

          var mixin = {};
          if($scope.applicants){
              mixin.applicant = true;
          }

          var modalInstance = $modal.open({
              templateUrl: 'partials/addCandidate.html',
              controller: 'ModalController',
              resolve: {
                  'ForcedData': function(){
                      return {
                          prepare: function(model){
                            if(model.GPA > 9){
                              model.GPA = (parseInt( ( (model.GPA + '000').substring(0, 3)))) / 100;
                            }
                          },
                          mixin: mixin
                      };
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
            updateData();
          }, function () {
              //console.log('Modal dismissed at: ' + new Date());
          });
      }

      $scope.showInterview = function(){
          var modalInstance = $modal.open({
            templateUrl: 'partials/addInterview.html',
            controller: 'ModalController',
            resolve: {
                'ForcedData': function(){
                    return {
                        noedit: true,
                        datetime: true,
                        mode: 'candidates',
                        title: 'Interview',
                        //Custom modal logic to add interview:
                        upload: function(model, cb){
                            model._id = $scope.um._id;
                            model.id = 'interview';
                            Candidates.interview(model, cb);
                        }
                    };
                }
            }
          });

          modalInstance.result.then(function (resAction) {
              updateData();
          }, function () {
              //Nope.
          });
      }

      $scope.addInterview = function(){
          $scope.udm._id = $scope.um._id;
          dataSet.interview($scope.udm, function(){
              $location.path('/candidates/view/' + $scope.um._id);
          });
      }

      $scope.addCandidate = function(){
          if($scope.edit){
              dataSet.update($scope.um,
                  function(user) {
                      $location.path('/candidates/view/' + $scope.um._id);
                  },
                  function(err) {
                      console.log(err);
                      alert('An error occured while saving.');
                  }
              );
          }else{
            dataSet.save($scope.um,
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
