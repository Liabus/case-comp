'use strict';

angular.module('caseCompApp')
    .controller('ModalController', function ($scope, $routeParams, $location, $timeout, $modalInstance, Candidates, Events, Jobs) {
        $scope.model = {};
        
        NProgress.done();
        
        var slicer = {
            'candidates': Candidates,
            'events': Events,
            'jobs': Jobs
        };
        
        var mode = $location.path().split('/')[1];
        var data = slicer[mode];
        
        $scope.edit = false;
        
        if($routeParams.id){
            $scope.edit = true;
            data.get({id: $routeParams.id}, function(res){
                $scope.model = res;
            }, function(){
                //not found:
                $modalInstance.dismiss('cancel');
            })
        }
        
        $scope.label = function(){
            //Cap first letter and remove the plural 's'.
            if($scope.edit){
                return 'Edit ' + mode.charAt(0).toUpperCase() + mode.slice(1).substring(0, mode.length - 2);
            }
            return 'Add ' + mode.charAt(0).toUpperCase() + mode.slice(1).substring(0, mode.length - 2);
        }
        
        $scope.add = function(){
            console.log('adding...');
            NProgress.start();
            if($scope.edit){
                data.update($scope.model,
                    function(user) {
                        NProgress.done();
                        $modalInstance.close('ok');
                    },
                    function(err) {
                        NProgress.done();
                        console.log(err);
                        alert('An error occured while saving.');
                        $modalInstance.close('bad');
                    }
                );
            }else{
                data.save($scope.model,
                  function(user) {
                      NProgress.done();
                      $modalInstance.close('ok');
                  },
                  function(err) {
                      console.log(err);
                      alert('An error occured while saving.');
                      $modalInstance.close('bad');
                  }
                );
            }
        }
        
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }
        
        $timeout(function(){
            $('.mask-decimal').inputmask('9.99', {placeholder: '', clearMaskOnLostFocus: true});
            $('.mask-phone').inputmask('(999) 999-9999');
        });
    });