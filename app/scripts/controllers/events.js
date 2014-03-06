'use strict';

angular.module('caseCompApp')
  .controller('eventsController', function ($scope, Events, $modal, $location, $routeParams, $sce, $timeout) {
      $scope.edit = false;
      $scope.events = [];
      $scope.um = {};

      $scope.sortMode = 'name';
      $scope.sortString = 'Name';
      //Does the opposite of what it sounds like:
      $scope.sortDesc = false;
      $scope.sortBackwards = false;

      $scope.searchMode = 'all';
      $scope.searchString = 'All';

      $scope.mapUrl = '';

      if($routeParams.id){
          $scope.edit = true;
      };

      $scope.fmtDate = function(input){
        if(input && moment(input)){
          return moment(input).format('MMMM Do, YYYY');
        }else{
          return input;
        }
      }

      $scope.updateMap = function(){
        $timeout(function(){
          $scope.mapUrl = $sce.trustAsResourceUrl('http://maps.google.com/maps?q=' + $scope.prepAddr($scope.um.address) + '&zoom=20&output=embed&t=' + Math.random());
        }, 0);
      };

      var updateData = function(){
          NProgress.start();
          if($scope.edit){
              Events.get({id: $routeParams.id}, function(res){
                  NProgress.done();
                  $scope.um = res;

                  $scope.mapUrl = $sce.trustAsResourceUrl('http://maps.google.com/maps?q=' + $scope.prepAddr($scope.um.address) + '&zoom=20&output=embed');

              }, function(){
                  NProgress.done();
                  $location.path('/events');
              });
          }else{
              Events.list(function(jobs){
                  NProgress.done();
                  $scope.events = jobs.events;
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


      $scope.pickRelevant = function(evt){
          var sm = $scope.sortMode.toLowerCase();
          if(sm === 'name') sm = '';

          var rel = sm || (evt.matched || '').toLowerCase() || 'name';

          if(rel === 'name'){
              return evt.university;
          }else if(rel === 'datetime' || rel === 'date'){
              return moment(evt.datetime).format("MMMM Do, YYYY") || candidate.university || '';
          }else{
              return evt[rel] || evt.university || '';
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



    $scope.prepAddr = function(input){
      return input.replace(' ', '');
    };



      $scope.addClicked = function(){
          NProgress.start();

          var modalInstance = $modal.open({
              templateUrl: 'partials/addEvent.html',
              controller: 'ModalController',
              resolve: {
                  'ForcedData': function(){
                      return {
                        usersMultiple: true
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









      $scope.addAttendee = function(){
          $scope.udm._id = $scope.um._id;
          Events.attendee($scope.udm, function(){
              $location.path('/events/view/' + $scope.um._id);
          });
      }





      $scope.addEvent = function(){
          if($scope.edit){
              //Being a Jabrone.
              //It's the best thing ever! Jabrones for life. I Jabrone, you Jabrone, he/she/it Jabrones. Jabronology, the study of Jabron.
              Events.update($scope.um,
                  function(user) {
                      $location.path('/events/view/' + $scope.um._id);
                  },
                  function(err) {
                      console.log(err);
                      alert('An error occured while saving.');
                  }
              );
          }else{
            Events.save($scope.um,
                function(user) {
                    $location.path('/events');
                },
                function(err) {
                    console.log(err);
                    alert('An error occured while saving.');
                }
            );
        }
      };

  });
