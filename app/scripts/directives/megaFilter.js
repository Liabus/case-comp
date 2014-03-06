'use strict';

var searchString = function(val, query){
  val = val || '';
  if(_.isArray(val)){
    val = val.join(', ');
  }
  return (val.toLowerCase().indexOf(query.toLowerCase()) >= 0);
};

angular.module('caseCompApp')
    .filter('megaFilter', function () {

        return function(items, searchText) {

            //First, reset all matched queries:
            angular.forEach(items, function(item) {
                item.matched = '';
              });

            if(!searchText || !searchText.query){
              return items;
            }

            var query = searchText.query || '';
            var type = searchText.type || 'all';

            var filtered = [];


            angular.forEach(items, function(item) {
              if(type === 'name' || type === 'all'){
                if(searchString(item.name, query)){
                  item.matched = 'name';
                  filtered.push(item);
                  return;
                }
              }
              if(type === 'university' || type === 'all'){
                if(searchString(item.university, query)){
                  item.matched = 'university';
                  filtered.push(item);
                  return;
                }
              }
              if(type === 'major' || type === 'all'){
                if(searchString(item.major, query)){
                  item.matched = 'major';
                  filtered.push(item);
                  return;
                }
              }
              if(type === 'minor' || type === 'all'){
                if(searchString(item.minor, query)){
                  item.matched = 'minor';
                  filtered.push(item);
                  return;
                }
              }
              if(type === 'gpa' || type === 'all'){
                if(+query <= +item.GPA){
                  item.matched = 'GPA';
                  filtered.push(item);
                  return;
                }
              }
            });

            return filtered;

        }
     })

     .filter('megaJobsFilter', function () {

         return function(items, searchText) {

             //First, reset all matched queries:
             angular.forEach(items, function(item) {
                 item.matched = '';
             });

             if(!searchText || !searchText.query){
                 return items;
             }

             var query = searchText.query || '';
             var type = searchText.type || 'all';

             var filtered = [];


              angular.forEach(items, function(item) {
                if(type === 'name' || type === 'all'){
                  if(searchString(item.name, query)){
                    item.matched = 'name';
                    filtered.push(item);
                    return;
                  }
                }
                if(type === 'description' || type === 'all'){
                  if(searchString(item.description, query)){
                    item.matched = 'description';
                    filtered.push(item);
                    return;
                  }
                }
                if(type === 'location' || type === 'all'){
                  if(searchString(item.location, query)){
                    item.matched = 'location';
                    filtered.push(item);
                    return;
                  }
                }
                if(type === 'type' || type === 'all'){
                  if(searchString(item.type, query)){
                    item.matched = 'type';
                    filtered.push(item);
                    return;
                  }
                }
                if(type === 'salary' || type === 'all'){

                     //Dollar Search:
                  if(query.charAt(0) === '$'){
                    query = query.substring(1);
                  }

                  var salary = item.salary || 0;

                  if(+query <= +salary){
                    item.matched = 'salary';
                    filtered.push(item);
                    return;
                  }
                }
              });

              return filtered;
            }
      }).filter('megaEventsFilter', function () {

          return function(items, searchText) {

              //First, reset all matched queries:
              angular.forEach(items, function(item) {
                  item.matched = '';
              });

              if(!searchText || !searchText.query){
                  return items;
              }

              var query = searchText.query || '';
              var type = searchText.type || 'all';

              var filtered = [];


               angular.forEach(items, function(item) {
                 if(type === 'name' || type === 'all'){
                   if(searchString(item.name, query)){
                     item.matched = 'name';
                     filtered.push(item);
                     return;
                   }
                 }
                 if(type === 'university' || type === 'all'){
                   if(searchString(item.university, query)){
                     item.matched = 'university';
                     filtered.push(item);
                     return;
                   }
                 }
                 if(type === 'type' || type === 'all'){
                   if(searchString(item.type, query)){
                     item.matched = 'type';
                     filtered.push(item);
                     return;
                   }
                 }
                 if(type === 'date' || type === 'all'){
                    var d = chrono.parseDate(query);
                    if(d){
                      d = moment(d).startOf('day');
                      var td = moment(item.datetime).startOf('day');
                      if(td.isAfter(d) || td.isSame(d)){
                        item.matched = 'date';
                        filtered.push(item);
                        return;
                      }
                    }

                 }
               });

               return filtered;
             }
       });
