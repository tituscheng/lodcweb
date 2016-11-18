(function() {
  'use strict';

  var SermonListController = function($scope, $rootScope, SermonService, $state) {
    function youtubeimage(url) {
      return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
    }

    SermonService.Get(function(response) {
      for(var i = 0; i < response.length; i++) {
        var sermon = response[i];
        sermon.media.img = youtubeimage(sermon.media.youtube);
      }
      console.log(response);
      $scope.sermons = response;
    });

    $scope.shouldDisplayVideo = false;

    $scope.select = function(chosenSermon) {
      $scope.shouldDisplayVideo = true;
      SermonService.setSermon(chosenSermon);
    }

    $scope.watch = function(sermon) {
      SermonService.setSermon(sermon);
      $state.go("sermonvideo");
    }

    console.log("SermonListController called!");
  }

  SermonListController.$inject = ['$scope', '$rootScope', 'SermonService', '$state'];
  angular.module('lodcWebApp').controller('SermonListController', SermonListController);

})();
