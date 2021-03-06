"use strict";

angular.module("caseCompApp", [ "ngCookies", "ngResource", "ngSanitize", "ngRoute", "ui.bootstrap", "ui.select2", "ui.mask", "angularCharts", "ngUpload" ]).config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when("/", {
        redirectTo: "/dashboard",
        authenticate: true
    }).when("/dashboard", {
        templateUrl: "partials/main",
        controller: "MainCtrl",
        authenticate: true
    }).when("/login", {
        templateUrl: "partials/login",
        controller: "LoginCtrl",
        reverseAuthenticate: true
    }).when("/signup", {
        templateUrl: "partials/signup",
        controller: "SignupCtrl",
        authenticate: true
    })

    .when("/offers/:view?/:id", {
        templateUrl: "partials/publicOfferView",
        controller: "offersController"
    })

    .when("/settings/:page?", {
        templateUrl: "partials/settings",
        controller: "SettingsCtrl",
        authenticate: true
    })

    .when("/analytics", {
        templateUrl: "partials/analytics",
        controller: "analyticsController",
        authenticate: true
    })

    .when("/jobs", {
        templateUrl: "partials/jobs",
        controller: "jobsController",
        authenticate: true
    }).when("/jobs/view/:id", {
        templateUrl: "partials/viewJob",
        controller: "jobsController",
        authenticate: true
    }).when("/jobs/add", {
        templateUrl: "partials/addJob",
        controller: "jobsController",
        authenticate: true
    }).when("/jobs/edit/:id", {
        templateUrl: "partials/addJob",
        controller: "jobsController",
        authenticate: true
    })

    .when("/events", {
        templateUrl: "partials/events",
        controller: "eventsController",
        authenticate: true
    }).when("/events/view/:id", {
        templateUrl: "partials/viewEvent",
        controller: "eventsController",
        authenticate: true
    }).when("/events/add", {
        templateUrl: "partials/addEvent",
        controller: "eventsController",
        authenticate: true
    }).when("/events/edit/:id", {
        templateUrl: "partials/addEvent",
        controller: "eventsController",
        authenticate: true
    }).when("/events/view/:id/attendee", {
        templateUrl: "partials/addAttendee",
        controller: "eventsController",
        authenticate: true
    })

    .when("/candidates", {
        templateUrl: "partials/candidates",
        controller: "candidatesController",
        authenticate: true
    }).when("/candidates/view/:id", {
        templateUrl: "partials/viewCandidate",
        controller: "candidatesController",
        authenticate: true
    }).when("/candidates/add", {
        templateUrl: "partials/addCandidate",
        controller: "candidatesController",
        authenticate: true
    }).when("/candidates/edit/:id", {
        templateUrl: "partials/addCandidate",
        controller: "candidatesController",
        authenticate: true
    }).when("/candidates/view/:id/interview", {
        templateUrl: "partials/addInterview",
        controller: "candidatesController",
        authenticate: true
    })

    .when("/applicants", {
        templateUrl: "partials/candidates",
        controller: "candidatesController",
        authenticate: true
    }).when("/applicants/view/:id", {
        templateUrl: "partials/viewCandidate",
        controller: "candidatesController",
        authenticate: true
    })

    .otherwise({
        redirectTo: "/dashboard"
    });


    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push([ "$q", "$location", function($q, $location) {
        return {
            responseError: function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path("/login");
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    } ]);

}).run(function($rootScope, $location, Auth) {
    $rootScope.$on("$routeChangeStart", function(event, next) {
        if (next.authenticate && !Auth.isLoggedIn()) {
            $location.path("/login");
        } else if(next.reverseAuthenticate && Auth.isLoggedIn()) {
            $location.path("/dashboard");
        } else {
            if($location.path().split('/')[1] === 'offers'){
              $rootScope.offerViewer = true;
            }else{
              $rootScope.offerViewer = false;
            }
            NProgress.start();

            if($('.navbar-collapse').hasClass('in'))
              $('.navbar-toggle').click();
        }
    });
    $rootScope.$on("$routeChangeSuccess", function() {
        NProgress.done();
    });
});

$(function() {
    FastClick.attach(document.body);
});
