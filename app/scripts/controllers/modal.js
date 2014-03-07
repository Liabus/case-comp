'use strict';

angular.module('caseCompApp')
    .controller('ModalController', function ($scope, $routeParams, $location, $timeout, $modalInstance, ForcedData, Applicants, Candidates, Events, Jobs) {

        ForcedData = ForcedData || {};

        $scope.model = {};

        var slicer = {
            'candidates': Candidates,
            'applicants': Applicants,
            'events': Events,
            'jobs': Jobs
        };

        $scope.startUploading = function() {
          //console.log('uploading....')
        };
        $scope.uploadComplete = function (content) {
          if(content.data){
            $scope.model.resumeUrl = content.data;
            alert('Resume has been uploaded and added to the candidate.');
          }
        }

        var mode = ForcedData.mode || $location.path().split('/')[1];
        var data = slicer[mode];

        $scope.edit = false;

        if($routeParams.id && !ForcedData.noedit){
            $scope.edit = true;
            data.get({id: $routeParams.id}, function(res){

                if(mode === 'events'){
                  _.each(res.attendees, function(a){
                    a.id = a._id;
                  });
                  _.each(res.hosts, function(h){
                    h.id = h._id;
                    h.text = h.name;
                  });
                }

                NProgress.done();
                $scope.model = res;
                if(ForcedData.restore)
                  ForcedData.restore($scope.model);
            }, function(){
                NProgress.done();
                //not found:
                $modalInstance.dismiss('cancel');
            });
        }else{
            _.extend($scope.model, ForcedData.defaultData || {});
            NProgress.done();
        }

        if(ForcedData && typeof ForcedData.edit === 'boolean'){
            $scope.edit = ForcedData.edit;
        }

        if(ForcedData && ForcedData.datetime){
            $scope.model.datetime = $scope.model.datetime || new Date();
        }


        $scope.label = function(exp){

            var title = exp || ForcedData.title || mode.charAt(0).toUpperCase() + mode.slice(1).substring(0, mode.length - 2);

            //Cap first letter and remove the plural 's'.
            if($scope.edit){
                return 'Edit ' + title;
            }
            return 'Add ' + title;
        }

        $scope.add = function(){
            NProgress.start();

            _.extend($scope.model, ForcedData.mixin || {});

            if(ForcedData.prepare){
              ForcedData.prepare($scope.model);
            }

            if(ForcedData.upload){
                ForcedData.upload($scope.model, function(){
                    NProgress.done();
                    $modalInstance.close('ok');
                });
            }else{
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
        }

        $scope.openDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function(){
                $($event.target).closest('.datepick').find('input').focus();
            });
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }


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
        };

        $scope.queryUsersOptions = {
            multiple: ForcedData.usersMultiple || false,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: '/api/users/search',
                data: function (term) {
                    return {
                        q: term // search term
                    };
                },
                results: function (data) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data

                    var mdata = _.map(data.users, function(usr){
                        return {
                            id: usr._id,
                            text: usr.name || usr.email
                        };
                    });

                    return {results: mdata};
                }
            }
        };

        $scope.queryCandidateOptions = {
            multiple: ForcedData.usersMultiple || false,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: '/api/candidates/search',
                data: function (term) {
                    return {
                        q: term // search term
                    };
                },
                results: function (data) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data
                    _.each(data.candidates, function(can){
                      can.id = can._id;
                    });
                    return {results: data.candidates};
                }
            },
            formatResult: function(can) {
                var markup = "<div class='candidate-search-result'>";

                markup += '<strong>' + can.firstName + ' ' + can.lastName + '</strong><br />';
                markup += '<span>' + can.university.join(', ') + '</span>';
                markup += '<span>' + can.major.join(', ') + '</span>';
                markup += '<span>GPA: ' + can.GPA + '</span>';

                markup += "</div>";
                return markup;
            },
            dropdownCssClass: "bigdrop",
            escapeMarkup: function(m) { return m; },
            formatSelection: function(can) {
                return can.firstName + ' ' + can.lastName;
            }
        };

    });
