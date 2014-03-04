'use strict';

angular.module('caseCompApp')
    .filter('megaFilter', function () {
        
        var searchString = function(val, query){
            if(_.isArray(val)){
                val = val.join(', ');
            }
            return (val.toLowerCase().indexOf(query.toLowerCase()) >= 0);
        }
        
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
        
         var searchString = function(val, query){
             if(_.isArray(val)){
                 val = val.join(', ');
             }
             return (val.toLowerCase().indexOf(query.toLowerCase()) >= 0);
         }
        
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
      });