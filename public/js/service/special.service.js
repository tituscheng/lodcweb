(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('SpecialService', SpecialService);

    SpecialService.$inject = ['$http', 'Restangular'];
    function SpecialService($http, Restangular) {

        var processDate = function(mySpecial) {
            // var myDate = moment(mySermon.date);
            mySpecial.displaydate = moment(mySpecial.date).format("LL");
            // var newDateFormat = new Date(dateStr);
            // return newDateFormat.getMonth() + "-" + newDateFormat.getDay() + "-" + newDateFormat.getFullYear();
        }

        var service = Restangular.all("special");  

        function Get(callback) {
            service.one("get").get().then(function(specials){
                var allspecials = specials.data
                for(var i = 0; i < allspecials.length; i++) {
                    processDate(allspecials[i]);
                }
                callback(allspecials);
            })
        }

        service.Get = Get;
        return service;
    }

})();
