(function() {
  'use strict';

  var SermonListController = function($scope, $rootScope, SermonService, $state, SpecialService, $uibModal) {
    function ytGetImage(url) {
      return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
    }
    var special_start_index = 0;
    var special_end_index = 0
    var special_display_limit = 4;
    var temp_buffer = []

    SermonService.Get(function(response) {
      for(var i = 0; i < response.length; i++) {
        var sermon = response[i];
        sermon.media.img = ytGetImage(sermon.media.youtube);
        sermon.link = sermon.media.youtube;
      }
      console.log(response);
      $scope.sermons = response;
    });

    SpecialService.Get(function(response){
      $scope.specialvideos = response;
      for(var i = 0; i < response.length; i++) {
        var special = response[i];
        special.img = ytGetImage(special.link);
      }
      temp_buffer = $scope.specialvideos.slice().reverse();
      var list = []
      while(list.length  < special_display_limit && temp_buffer.length != 0){
        list.push(temp_buffer.pop());
      }
      $scope.specials = list
    })

    $scope.next = function() {
      var new_list = [];
      if(temp_buffer.length == 0) {
        temp_buffer = $scope.specialvideos.slice().reverse();
      }
      while(new_list.length < special_display_limit && temp_buffer.length != 0) {
        new_list.push(temp_buffer.pop());
      }
      $scope.specials = new_list;
    }

    $scope.open = function(videoObject) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/video.modal.view.html',
        controller: "VideoModalController",
        size: "lg",
        resolve: {
          youtube: function() {
            return videoObject;
          }
        }
      });
    }

    if($rootScope.selectedSermon) {
      $rootScope.selectedSermon.link = $rootScope.selectedSermon.media.youtube;
      $scope.open($rootScope.selectedSermon);
    }
    
    console.log("SermonListController called!");
  }

  SermonListController.$inject = ['$scope', '$rootScope', 'SermonService', '$state', 'SpecialService', "$uibModal"];
  angular.module('lodcWebApp').controller('SermonListController', SermonListController);

})();
