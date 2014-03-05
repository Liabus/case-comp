'use strict';

angular.module('caseCompApp')
  .controller('offersController', function ($scope, $routeParams, $rootScope, $location, Jobs) {

    $rootScope.offerViewer = true;

    $scope.offer = {};

    $scope.actioned = false;

    Jobs.viewOffer({offer: $routeParams.id}, function(a, b){
      $scope.offer = a.offer.offers[0];

      if($scope.offer.status === 'Accepted' || $scope.offer.status === 'Declined'){
        $scope.actioned = true;
      }

      if($routeParams.view && $routeParams.view === 'v' && $scope.offer.status === 'Sent' || $scope.offer.status === 'Pending'){
        Jobs.get({id: 'offerStatus', offer: $routeParams.id, status: 'Viewed'}, function(a, b){
          //yay...
        });
      }
    });

    $scope.accept = function(){
      $scope.actioned = true;
      $scope.acc = true;
      Jobs.get({id: 'offerStatus', offer: $routeParams.id, status: 'Accepted'}, function(a, b){
        // :)
      });
    }

    $scope.decline = function(){
      $scope.actioned = true;
      $scope.dec = true;
      Jobs.get({id: 'offerStatus', offer: $routeParams.id, status: 'Declined'}, function(a, b){
        // :(
      });
    }

  });
