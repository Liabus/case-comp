'use strict';

angular.module('caseCompApp')
  .controller('MainCtrl', function ($scope, $http, Jobs, Candidates, Events) {
      $scope.jobs = [];
      $scope.candidates = [];
      $scope.events = [];
      
      Jobs.list(function(res){
          $scope.jobs = res.jobs.slice(0, 2);
      });
      
      Candidates.list(function(res){
          $scope.candidates = res.candidates.slice(0, 2);
      });
      
      
      //Get the context of the canvas element we want to select
      var GPAdata = {
      	labels : ["CS","EE","CE","Business","Finance","Math","Economics"],
      	datasets : [
      		{
      			fillColor : "rgba(151,187,205,0.5)",
      			strokeColor : "rgba(151,187,205,1)",
      			data : [28,48,40,19,96,27,100]
      		}
      	]
      }

      var UniAppsData = [
      	{
      		value: 30,
      		color:"#F7464A"
      	},
      	{
      		value : 80,
      		color : "#C8D490"
      	},
      	{
      		value : 120,
      		color : "#4D5360"
      	}

      ]

      var UniOffsData = [
      	{
      		value: 30,
      		color:"#F7464A"
      	},
      	{
      		value : 80,
      		color : "#C8D490"
      	},
      	{
      		value : 120,
      		color : "#4D5360"
      	}

      ]

      // code that should be taken care of right away

     
          // the code to be called when the dom has loaded
          var canvas = document.getElementById("MajorGPA");
      	var ctx = canvas.getContext("2d");
      	var MajorGPA = new Chart(ctx).Bar(GPAdata,{scaleShowLabels : false, scaleFontColor : "#767C8D"});

      	var canvas = document.getElementById("UniApps");
      	var ctx = canvas.getContext("2d");
      	var MajorGPA = new Chart(ctx).Doughnut(UniAppsData,{scaleShowLabels : false, scaleFontColor : "#767C8D"});

      	var canvas = document.getElementById("UniOffs");
      	var ctx = canvas.getContext("2d");
      	var MajorGPA = new Chart(ctx).Doughnut(UniAppsData,{scaleShowLabels : false, scaleFontColor : "#767C8D"});


      
      
      /*
      Events.list(function(res){
          $scope.events = res.events.slice(0, 2);
      });
      */
  });
