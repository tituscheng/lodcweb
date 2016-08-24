var adminApp = angular.module("adminApp", []);

adminApp.controller("SermonTranslationDistributeController", function($scope){
  console.log("test");
    $scope.test = function() {
      alert("Test");
    };
    
    $scope.part2 = "Test";
});