'use strict';

angular.module('caseCompApp')
  .controller('jobsController', function ($scope, Jobs, $location, $routeParams, $modal) {
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

                  console.log(res);

                  _.each(res.applicants, function(app){
                    app.statusInt = 1;
                    if(app.status.toLowerCase() === 'rejected'){
                      app.statusInt = -1;
                    }else if(app.status.toLowerCase() === 'offered'){
                      app.statusInt = 2;
                    }else if(app.status.toLowerCase() === 'accepted'){
                      app.statusInt = 3;
                    }
                  });

                  $scope.jobModel = res;
              }, function(){
                  NProgress.done();
                  $location.path('/jobs');
              });
          }else{
              Jobs.list(function(jobs){
                  NProgress.done();

                  _.each(jobs.jobs, function(job){
                    job.statusInt = 3;
                    if(job.status.toLowerCase() === 'pending'){
                      job.statusInt = 2;
                    }else if(job.status.toLowerCase() === 'filled'){
                      job.statusInt = 1;
                    }
                  });

                  $scope.jobs = jobs.jobs;
              });
          }
      };

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

      $scope.getSortModeString = function(){
          var start = $scope.getSortDesc() ? '-' : '';
          start += $scope.sortMode;
          return start;
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
      };


      $scope.addClicked = function(){
          NProgress.start();

          var modalInstance = $modal.open({
              templateUrl: 'partials/addJob.html',
              controller: 'ModalController',
              resolve: {
                  'ForcedData': function(){
                      return {};
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
            updateData();
          }, function () {
              //console.log('Modal dismissed at: ' + new Date());
          });
      };


      $scope.editApplicant = function(app){
        NProgress.start();

        var modalInstance = $modal.open({
            templateUrl: 'partials/addJobApplicant.html',
            controller: 'ModalController',
            resolve: {
                'ForcedData': function(){
                    return {
                      title: 'Job Applicant',
                      mode: 'JA',
                      noedit: true,
                      edit: true,
                      //Defaults, basically:
                      defaultData: _.cloneDeep(app),
                      upload: function(model, callback){
                        var modelClone = _.cloneDeep(model);
                        modelClone.candidate = model.candidate._id;
                        modelClone.job = $scope.jobModel._id;
                        Jobs.applicant(modelClone, function(a, b){
                          console.log(a, b);
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

      $scope.addApplicant = function(){
          NProgress.start();

          var modalInstance = $modal.open({
              templateUrl: 'partials/addJobApplicant.html',
              controller: 'ModalController',
              resolve: {
                  //Really busting out the ForcedData attributes here.

                  /*
                    As a quick note, as these are undocumented everywhere, the
                    basic goal of the modal type is to include all of the
                    functionality for adding/editing the core models. Where
                    they break down is with subdocuments and certain types of
                    editing. The ForcedData add-in lets us basically override
                    certain assumptions that the Modal takes, and lets us
                    even provide our own saving function that can utilize
                    local scope, and other goodies.
                  */

                  'ForcedData': function(){
                      return {
                        title: 'Job Applicant',
                        mode: 'JA',
                        noedit: true,
                        edit: false,
                        //Defaults, basically:
                        defaultData: {
                          status: 'Pending'
                        },
                        upload: function(model, callback){
                          var modelClone = _.cloneDeep(model);
                          modelClone.candidate = model.candidate._id;
                          modelClone.job = $scope.jobModel._id;
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


      $scope.createOffer = function(){
          NProgress.start();

          var modalInstance = $modal.open({
              templateUrl: 'partials/addJobOffer.html',
              controller: 'ModalController',
              resolve: {
                  'ForcedData': function(){
                      return {
                        title: 'Job Offer',
                        mode: 'JO',
                        noedit: true,
                        edit: false,
                        //Defaults, basically:
                        defaultData: {
                          status: 'Sent',
                          emailToCandidate: true,
                          changeJobStatus: true,
                          autoReject: true,
                          emailRejected: true
                        },
                        upload: function(model, callback){
                          var modelClone = _.cloneDeep(model);

                          modelClone.candidateEmail = model.candidate.email;
                          modelClone.candidate = model.candidate._id;
                          modelClone.job = $scope.jobModel._id;

                          Jobs.offer(modelClone, function(a, b){
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

      $scope.editOffer = function(offer){
          NProgress.start();

          var modalInstance = $modal.open({
              templateUrl: 'partials/addJobOffer.html',
              controller: 'ModalController',
              resolve: {
                  'ForcedData': function(){
                      return {
                        title: 'Job Offer',
                        mode: 'JO',
                        noedit: true,
                        edit: true,
                        //Defaults, basically:
                      defaultData: _.cloneDeep(offer),
                        upload: function(model, callback){
                          var modelClone = _.cloneDeep(model);

                          modelClone.candidateEmail = model.candidate.email;
                          modelClone.candidate = model.candidate._id;
                          modelClone.job = $scope.jobModel._id;

                          Jobs.offer(modelClone, function(a, b){
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



  });
