(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('EmailService', EmailService);

    EmailService.$inject = ['$http', 'Restangular'];
    function EmailService($http, Restangular) {

        var service = Restangular.all("email");  

        function Email(param, callback) {
            service.post(param).then(function(result){
                callback(result);
            })
        }

        service.Email = Email;


        return service;
    }

})();
