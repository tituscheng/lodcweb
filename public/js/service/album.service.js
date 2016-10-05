(function () {
    'use strict';

    angular
        .module('lodcWebApp')
        .factory('AlbumService', AlbumService);

    AlbumService.$inject = ['$http', 'Restangular'];
    function AlbumService($http, Restangular) {

        var service = Restangular.all("album");  

        function GetPublic(callback) {
            Restangular.one("album/public_albums").get().then(function(result){
                callback(result);
            })
        }

        function GetAlbumsByYear(param, callback) {
            Restangular.one("albums/year").get(param).then(function(result){
                callback(result);
            })
        }

        function GetAlbumByID(param, callback) {
            Restangular.one("album/id").get(param).then(function(result){
                callback(result);
            })
        }

        service.GetPublic = GetPublic;
        service.GetAlbumsByYear = GetAlbumsByYear;
        service.GetAlbumByID = GetAlbumByID;

        return service;
    }

})();
