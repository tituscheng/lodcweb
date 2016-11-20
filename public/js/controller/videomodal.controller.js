(function() {
  'use strict';

  var VideoModalController = function($scope, $rootScope, $sce, $state, $uibModalInstance, youtube) {
    $scope.video = youtube;

    $scope.scripture = (youtube.hasOwnProperty('scripture') ? youtube.scripture:{})

    $scope.close = function() {
      $uibModalInstance.close("close");
    }

  }

  VideoModalController.$inject = ['$scope', '$rootScope', "$sce", "$state", "$uibModalInstance", "youtube"];
  angular.module('lodcWebApp').controller('VideoModalController', VideoModalController);

})();
