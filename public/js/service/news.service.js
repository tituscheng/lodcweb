(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('NewsService', NewsService);

    NewsService.$inject = ['$http', 'Restangular'];
    function NewsService($http, Restangular) {

        var processDate = function(dateStr) {
            return dateStr;
            // var newDateFormat = new Date(dateStr);
            // return newDateFormat.getMonth() + "-" + newDateFormat.getDay() + "-" + newDateFormat.getFullYear();
        }

        var service = Restangular.all("news");  

        function Get(callback) {
            service.one("get").get().then(function(news){
                var allnews = news.data;
                for(var i = 0; i < allnews.length; i++) {
                    var mymoment = moment(allnews[i].date);
                    allnews[i].month = mymoment.format("MMM").toUpperCase();
                    allnews[i].day = mymoment.date();
                }
                callback(allnews);
            })
        }

        // function setSermon(theSermon) {
        //     selectedSermon = theSermon;
        // }

        // function getSermon() {
        //     return selectedSermon;
        // }

        // service.GetMostRecent = GetMostRecent;
        service.Get = Get;
        // service.setSermon = setSermon;
        // service.getSermon = getSermon;
        // service.GetDetail = GetDetail;
        // service.Update= Update;
        // service.Create= Create;
        // service.Delete= Delete;

        return service;
    }

})();
