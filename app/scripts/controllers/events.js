'use strict';

angular.module('caseCompApp')
  .controller('eventsController', function ($scope, Events, $location, $routeParams) {
      $scope.edit = false;
      $scope.events = [];
      $scope.um = {};
      
      if($routeParams.id){
          $scope.edit = true;
          Events.get({id: $routeParams.id}, function(res){
              if(!res){
                  $location.path('/events');
                  return;
              }
              $scope.um = res;
          }, function(){
              $location.path('/events');
          })
      }
      
      Events.list(function(jobs){
          $scope.events = jobs.events;
      });
      
      $scope.addEventLabel = function(){
          if($scope.edit){
              return 'Edit Events';
          }
          return 'Add Events';
      }
      
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