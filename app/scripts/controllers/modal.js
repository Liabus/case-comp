'use strict';

angular.module('caseCompApp')
    .controller('ModalController', function ($scope, $routeParams, $location, $timeout, $modalInstance, Candidates, Events, Jobs) {
        $scope.model = {};
        
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
                NProgress.done();
                $scope.model = res;
            }, function(){
                NProgress.done();
                //not found:
                $modalInstance.dismiss('cancel');
            });
        }else{
            NProgress.done();
        }
        
        $scope.label = function(){
            //Cap first letter and remove the plural 's'.
            if($scope.edit){
                return 'Edit ' + mode.charAt(0).toUpperCase() + mode.slice(1).substring(0, mode.length - 2);
            }
            return 'Add ' + mode.charAt(0).toUpperCase() + mode.slice(1).substring(0, mode.length - 2);
        }
        
        $scope.add = function(){
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
                        //$modalInstance.close('bad');
                    }
                );
            }else{
                data.save($scope.model,
                  function(user) {
                      NProgress.done();
                      $modalInstance.close('ok');
                  },
                  function(err) {
                      NProgress.done();
                      console.log(err);
                      alert('An error occured while saving.');
                      //$modalInstance.close('bad');
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
        
        
        
        
        
        
        $scope.inputUniversities = {
            multiple: true,
            simple_tags: true,
            tags: [
                'DePauw University',
                'Indiana University',
                'Michigan State University',
                'Northwestern University',
                'Ohio State University',
                'Pennsylvania State University',
                'Purdue University',
                'University of Chicago',
                'University of Illinois',
                'University of Iowa',
                'University of Michigan',
                'University of Minnesota',
                'University of Nebraska-Lincoln',
                'University of Wisconsin'
            ]
        };
        $scope.inputMajors = {
            multiple: true,
            simple_tags: true,
            tags: [
                'Accounting',
                'Aerospace Engineering',
                'Agricultural and Biological Engineering',
                'Bioengineering',
                'Business Process Management',
                'Chemical and Biomolecular Engineering',
                'Chemical Engineering',
                'Civil and Environmental Engineering',
                'Computational Science and Engineering',
                'Computer Science',
                'Electrical and Computer Engineering',
                'Finance',
                'Industrial and Enterprise Systems Engineering',
                'Information Systems and Information Technology',
                'Management: General',
                'Management: International Business',
                'Marketing',
                'Materials Science and Engineering',
                'Mechanical Science and Engineering',
                'Nuclear, Plasma, and Radiological Engineering',
                'Physics',
                'Supply Chain Management',
                'Other'
            ]
        };
        $scope.inputMinors = {
            multiple: true,
            simple_tags: true,
            tags: [
                'Bioengineering',
                'Business',
                'Chemistry',
                'Computer Science',
                'Material Science and Engineering',
                'Mathematics',
                'Molecular Biology',
                'Physics',
                'Statistics',
                'Technology and Management',
                'Other'
            ]
        }
    });