'use strict';

angular.module('caseCompApp')
  .controller('analyticsController', function ($scope, Auth, $location, $timeout, Candidates, Events, Jobs){


    $scope.candidatesBySchool = {
      config: {
        title : '',
        tooltips: false,
        labels : false,
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      },
      data: {
        series: [],
    		data : []
      }
    };
    $scope.averageGPA = {
      config: {
        title : '',
        tooltips: false,
        labels : false,
        legend: {
          display: false,
          //could be 'left, right'
          position: 'right'
        }
      },
      data: {
        series: [],
        data : []
      }
    };
    $scope.topMajors = {
      config: {
        title : '',
        tooltips: false,
        labels : false,
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      },
      data: {
        series: [],
        data : []
      }
    };

    $scope.offersBySchool = {
      config: {
        title : '',
        tooltips: false,
        labels : false,
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      },
      data: {
        series: [],
        data : []
      }
    };

    Jobs.list(function(res){
      var jdata = {};
      _.each(res.jobs, function(job){
        _.each(job.offers, function(offer){
          _.each(offer.candidate.university, function(uni){
            if(!jdata[uni]){
              jdata[uni] = 0;
            }
            jdata[uni]++;
          });
        });
      });

      var jobData = _.pairs(jdata);

      jobData.sort(function(a, b){
        if(a[1] > b[1]){
          return -1;
        }else if(a[1] === b[1]){
          return 0;
        }else{
          return 1;
        }
      });

      var obs = $scope.offersBySchool.data;
      _.each(jobData, function(dat){
        obs.series.push(dat[0]);
        obs.data.push({
          x: dat[0],
          y: [dat[1]]
        });
      });

    });



    Candidates.list(function(res){
      var tdata = {};
      var mdata = {};
      _.each(res.candidates, function(can){
        //Candidates By School + GPA by school + majors:
        _.each(can.university, function(uni){
          if(!tdata[uni]){
            tdata[uni] = {'gpa': [], count: 0};
          }
          if(can.GPA){
            tdata[uni].gpa.push(can.GPA);
          }
          tdata[uni].count++;
        });

        _.each(can.major, function(maj){
          if(!mdata[maj]){
            mdata[maj] = 0;
          }
          mdata[maj]++;
        });
      });

      var uniData = _.pairs(tdata);
      var gpaData = _.pairs(tdata);
      var majorData = _.pairs(mdata);

      //Sort our uni data:
      uniData.sort(function(a, b){
        if(a[1].count > b[1].count){
          return -1;
        }else if(a[1].count === b[1].count){
          return 0;
        }else{
          return 1;
        }
      });

      //sort our GPA data:
      _.each(gpaData, function(g){
        var sum = 0;
        for(var i = 0; i < g[1].gpa.length; i++){
            sum += g[1].gpa[i];
        }
        g[1].average = sum / g[1].gpa.length;
      });

      gpaData.sort(function(a, b){
        if(a[1].average > b[1].average){
          return -1;
        }else if(a[1].average === b[1].average){
          return 0;
        }else{
          return 1;
        }
      });

      //Sort our major data:
      majorData.sort(function(a, b){
        if(a[1] > b[1]){
          return -1;
        }else if(a[1] === b[1]){
          return 0;
        }else{
          return 1;
        }
      });



      //Load Data:
      var cbs = $scope.candidatesBySchool.data;
      _.each(uniData, function(dat){
        cbs.series.push(dat[0]);
        cbs.data.push({
          x: dat[0],
          y: [dat[1].count]
        });
      });

      var agpa = $scope.averageGPA.data;
      _.each(gpaData, function(ddat){
        agpa.series.push(ddat[0]);
        agpa.data.push({
          x: ddat[0],
          y: [ddat[1].average]
        });
      });

      var tm = $scope.topMajors.data;
      _.each(majorData, function(dddat){
        tm.series.push(dddat[0]);
        tm.data.push({
          x: dddat[0],
          y: [dddat[1]]
        });
      });

    });

    $scope.chart = [
		{
			labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			datasets : [
				{
					fillColor : "rgba(151,187,205,0)",
					strokeColor : "#e67e22",
					pointColor : "rgba(151,187,205,0)",
					pointStrokeColor : "#e67e22",
					data : [4, 3, 5, 4, 6]
				},
				{
					fillColor : "rgba(151,187,205,0)",
					strokeColor : "#f1c40f",
					pointColor : "rgba(151,187,205,0)",
					pointStrokeColor : "#f1c40f",
					data : [8, 3, 2, 5, 4]
				}
			],
		}, {
			labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			datasets : [
				{
					fillColor : "#f1c40f",
					strokeColor : "#f1c40f",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [7,3,4,6,7]
				},
				{
					fillColor : "#FF0000",
					strokeColor : "#e67e22",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [0,3,4,6,1]
				}
			],
		}, {
			labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			datasets : [
				{
					fillColor : "#f1c40f",
					strokeColor : "#f1c40f",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [7,3,4,6,7]
				},
				{
					fillColor : "#FF0000",
					strokeColor : "#e67e22",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [0,3,4,6,1]
				}
			],
		}, [
			{
					value : 30,
					color: "#D97041"
				},
				{
					value : 90,
					color: "#C7604C"
				},
				{
					value : 24,
					color: "#21323D"
				},
				{
					value : 58,
					color: "#9D9B7F"
				},
				{
					value : 82,
					color: "#7D4F6D"
				},
				{
					value : 8,
					color: "#584A5E"
			}
		]
	]

	$scope.options = {

		segmentShowStroke : false
	}
  });
