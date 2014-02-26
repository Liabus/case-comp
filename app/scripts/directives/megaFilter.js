'use strict';

angular.module('caseCompApp')
    .filter('megaFilter', function () {
        
        var searchString = function(val, query){
            return (val.toLowerCase().indexOf(query.toLowerCase()) >= 0);
        }
        
        return function(items, searchText) {
            
            if(!searchText || !searchText.query){
                return items;
            }
            
            var query = searchText.query || '';
            var type = searchText.type || 'all';
            
            var filtered = [];
            angular.forEach(items, function(item) {
                if(type === 'name' || type === 'all'){
                    if(searchString(item.name, query)){
                        filtered.push(item);
                        return;
                    }
                }
                if(type === 'university' || type === 'all'){
                    if(searchString(item.university, query)){
                        filtered.push(item);
                        return;
                    }
                }
                if(type === 'major' || type === 'all'){
                    if(searchString(item.major, query)){
                        filtered.push(item);
                        return;
                    }
                }
                if(type === 'minor' || type === 'all'){
                    if(searchString(item.major, query)){
                        filtered.push(item);
                        return;
                    }
                }
                if(type === 'gpa' || type === 'all'){
                    if(+query <= +item.GPA){
                        filtered.push(item);
                        return;
                    }
                }
            });
            
            return filtered;
            
        }
     });