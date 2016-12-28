(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('WebContentService', WebContentService);

    WebContentService.$inject = ['$http', 'Restangular'];
    function WebContentService($http, Restangular) {
        var service = Restangular.all("webcontent");  
        function GetContent(callback) {
            service.one("get").get().then(function(result){
                callback(result);
            })
        }

        service.GetContent = GetContent;

        return service;
    }

})();
