angular.module('caseCompApp')
    .controller('DeleteModalController', function ($scope, $modalInstance, type, name) {
          
        $scope.name = name;
        $scope.type = type;
          
          $scope.ok = function () {
            $modalInstance.close('yes');
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
    });