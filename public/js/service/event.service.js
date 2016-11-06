(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('EventService', EventService);

    EventService.$inject = ['$http', 'Restangular'];
    function EventService($http, Restangular) {
        var selectedSermon = {};

        var service = Restangular.all("event");  

        function Get(callback) {
            service.one("get").get().then(function(events){
                var allevents = events.data.events;
                callback(allevents);
            })
        }

        function GetLatest(callback) {
            service.one('latest').get().then(function(events){
                var latestevents = events.data;
                callback(latestevents);
            })
        }

        function setSermon(theSermon) {
            selectedSermon = theSermon;
        }

        function getSermon(callback) {
            callback(selectedSermon);
        }

        // service.GetMostRecent = GetMostRecent;
        service.Get = Get;
        service.GetLatest = GetLatest;
        service.setSermon = setSermon;
        service.getSermon = getSermon;
        // service.GetDetail = GetDetail;
        // service.Update= Update;
        // service.Create= Create;
        // service.Delete= Delete;

        return service;
    }

})();
